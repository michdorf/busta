<script lang="ts">
	import appState from '$lib/stato/app';
	import oauthclient from '$lib/oauth-client';
    import Stato, { reset } from '$lib/stato/main'; // Ensure load
	import { BASEPATH } from '$lib/base-path';

    function login() {
        oauthclient.authorizationCode("");
    }

    function resetApp() {
        if (confirm("Sei sicuro?")) {
            reset();
        }
    }
</script>

<nav>
    <a href={`${BASEPATH}/conti`}>Agg. conto</a>
    <a href={`${BASEPATH}/buste`}>Buste/bilanci</a>
</nav>

{#if $appState.authState != "authorized"}
<button on:click={login}>Login</button>
{/if}

<slot></slot>

<div style="margin-top: 100px;">
    <button on:click={resetApp}>Reset</button>
</div>