<script lang="ts">
    import oauthclient from "$lib/oauth-client";
    if (window.location.search.indexOf("code=") !== -1) {
        oauthclient.exchangeAuthCode();
    }
</script>