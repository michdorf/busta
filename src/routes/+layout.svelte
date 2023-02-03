<script context="module" lang="ts">
    declare function entri_sul_server(entrato: (entrato: boolean) => void): void;
</script>
<script lang="ts">
    import { fly } from "svelte/transition";
	import appState, { initLogin, setLoginError } from '$lib/stato/app-state';
	import oauthclient from '$lib/oauth-client';
    import Stato, { reset } from '$lib/stato/main'; // Ensure load
    import {} from '$lib/workers/aggiorna-bilanci';
	import { BASEPATH } from '$lib/base-path';
    import conti from "$lib/stato/conti";
	import Debug from '$lib/c/debug.svelte';

    initLogin();

    function login() {
        oauthclient.authorizationCode("");
    }

    function resetApp() {
        if (confirm("Sei sicuro?")) {
            reset();
        }
    }

    function loginScriptLoaded() {
        console.log("Script loaded");
        entri_sul_server((entrato) => {
            console.log("ENtrato? " + entrato);
            appState.update(($appState) => {
                $appState.authState = entrato ? "authorized" : "no token";
                return $appState;
            })
            if (!entrato) {
                setLoginError("Could not log automatically in.");
                let url = "https://dechiffre.dk/login.php?redir=" + location.pathname;
                window.location = url as unknown as Location;
            }
        });
    }
</script>

<svelte:head>
    <title>Buste Budget</title>
    <!-- <script type="text/javascript" src="https://dechiffre.dk/login/js/login.js" on:load={loginScriptLoaded}></script>
    <script type="text/javascript">
        
    </script> -->
</svelte:head>

{#if $appState.loginError}
    <div class="error" transition:fly>
        {$appState.loginError}<br/>
        <a href={"https://dechiffre.dk/login.php?redir=" + location.pathname}>Go to login</a>
    </div>
{/if}
<nav style="margin-bottom: 2rem;">
    <a href={`${BASEPATH}/conti`}>Add account</a>
    <a href={`${BASEPATH}/buste`}>Envelopes/Budget</a>
    &bull; Transactions: 
    {#each $conti as conto}
    <a href={`${BASEPATH}/trasferimenti/${conto.id}`}><b>{conto.nome}</b></a>
    {/each}
</nav>

{#if $appState.authState != "authorized"}
<button on:click={login}>Login</button><br>
{/if}

<slot></slot>

<Debug>
    <div style="margin-top: 100px;">
        <button on:click={resetApp}>Reset</button>
    </div>
</Debug>

<style>
    .error {
        width: 680px;
        max-width: 100%;
        background-color: rgb(var(--red));
        border-color: red;
        padding: 0.4rem;
        border-radius: 0.6rem;
        margin: auto;
    }
</style>