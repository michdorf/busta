import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';

const config: UserConfig = {
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	server: {
		fs: {
			allow: ["/Users/michele/Progetti/busta/moduli", "/Users/michele/Progetti/busta/oauth-client"]
		}
	}
};

export default config;
