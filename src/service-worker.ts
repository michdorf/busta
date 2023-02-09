/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />
 
const sw = /** @type {ServiceWorkerGlobalScope} */ (/** @type {unknown} */ (self));
import { build, files, prerendered, version } from '$service-worker';
 
// Generate unique ID for new cache
const cacheId = `cache-${version}`;

// Build files + /static files + prerendered pages
const cachePayloadArr = [...build, ...files, ...prerendered];
const cachePayloadSet = new Set(cachePayloadArr);

sw.addEventListener('install', (event) => {
	event.waitUntil(
		caches
			.open(cacheId)
			.then((cache) => cache.addAll(cachePayloadArr))
			.then(() => sw.skipWaiting())
	);
});

sw.addEventListener('activate', (event) => {
	event.waitUntil(
		caches.keys().then(async (keys) => {
			for (const key of keys) {
				if (key !== cacheId) await caches.delete(key);
			}

			sw.clients.claim();
		})
	);
});

// prettier-ignore
sw.addEventListener('fetch', (event) => {
	if (
		event.request.method !== 'GET' || 
		event.request.headers.has('range')
	) return

	const { 
		isHttp, 
		isLocal, 
		isStaticAsset, 
		isUncached 
	} = checks(event)

	if (isHttp && isLocal && !isUncached) {
		event.respondWith(
			(async () => {
				const cachedAsset =
					isStaticAsset && 
					(await caches.match(event.request))

				return cachedAsset || fetchAndCache(event.request)
			})()
		)
	}
})

// prettier-ignore
function checks(event) {
	const url = new URL(event.request.url)

	// Omit data urls, etc...
	const isHttp = url.protocol.startsWith('http')

	// Is the resource within the scope of the app?
	const isLocal =
		url.hostname === sw.location.hostname &&
		url.port === sw.location.port

	const isStaticAsset =
		url.host === sw.location.host && 
		cachePayloadSet.has(url.pathname)

	// Was the resource cached on install?
	const isUncached =
		event.request.cache === 'only-if-cached' && 
		!isStaticAsset

	return {
		isHttp,
		isLocal,
		isStaticAsset,
		isUncached
	}
}

async function fetchAndCache(request) {
	const cache = await caches.open(`offline${version}`);

	try {
		const response = await fetch(request);
		cache.put(request, response.clone());

		return response;
	} catch (err) {
		const response = await cache.match(request);
		if (response) return response;

		throw err;
	}
}