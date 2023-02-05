<script lang="ts">
    import {goto} from '$app/navigation';
	import { BASEPATH } from '$lib/base-path';

    import oauthclient from "$lib/oauth-client";
	import { initLogin } from '$lib/stato/app-state';
    if (typeof window != "undefined" && window.location.search.indexOf("code=") !== -1) {
        oauthclient.exchangeAuthCode().then(() => { 
            initLogin();
            goto(BASEPATH + '/');
        });
    }
</script>