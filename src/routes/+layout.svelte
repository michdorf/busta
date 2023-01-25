<script lang="ts">
	import appState from '$lib/stato/app';
	import oauthclient from '$lib/oauth-client';
    import Stato from '$lib/stato/main'; // Ensure load

    function login() {
        oauthclient.authorizationCode("");
    }
</script>

<nav>
    <a href="/conti">Agg. conto</a>
    <a href="/buste">Buste/bilanci</a>
</nav>

{#if $appState.authState != "authorized"}
<button on:click={login}>Login</button>
{/if}

<slot></slot>