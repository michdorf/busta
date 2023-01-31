<script lang="ts">
	import appState from '$lib/stato/app-state';
	import oauthclient from '$lib/oauth-client';
    import Stato, { reset } from '$lib/stato/main'; // Ensure load
    import {} from '$lib/workers/aggiorna-bilanci';
	import { BASEPATH } from '$lib/base-path';
    import conti from "$lib/stato/conti";

    function login() {
        oauthclient.authorizationCode("");
    }

    function resetApp() {
        if (confirm("Sei sicuro?")) {
            reset();
        }
    }
</script>

<svelte:head>
    <title>Buste Budget</title>
    <script type="text/javascript" src="https://dechiffre.dk/login/js/login.js"></script>
    <script type="text/javascript">
        window.addEventListener('DOMContentLoaded', (event) => {
            entri_sul_server(function entrato(entrato) {
                if (!entrato) {
                    window.location = "https://dechiffre.dk/login.php?redir=" + location.pathname;
                }
            });
        }); 
    </script>
</svelte:head>

<nav style="margin-bottom: 2rem;">
    <a href={`${BASEPATH}/conti`}>Agg. conto</a>
    <a href={`${BASEPATH}/buste`}>Buste/bilanci</a>
    &bull;
    {#each $conti as conto}
    <a href={`${BASEPATH}/trasferimenti/${conto.id}`}><b>{conto.nome}</b></a>
    {/each}
</nav>

{#if $appState.authState != "authorized"}
<button on:click={login}>Login</button>
{/if}

<slot></slot>

<div style="margin-top: 100px;">
    <button on:click={resetApp}>Reset</button>
</div>