<script lang="ts">
    import {goto} from '$app/navigation';

    import oauthclient from "$lib/oauth-client";
    if (typeof window != "undefined" && window.location.search.indexOf("code=") !== -1) {
        oauthclient.exchangeAuthCode().then(() => goto('/'));
    }
</script>