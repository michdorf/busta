<script context="module" lang="ts">
    declare function entri_sul_server(entrato: (entrato: boolean) => void): void;
</script>
<script lang="ts">
    import { fly } from "svelte/transition";
	import appState, { initLogin, setLoginError, loginError } from '$lib/stato/app-state';
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

{#if $loginError}
    <div class="error" transition:fly>
        {$loginError}<br/>
        <a href={"https://dechiffre.dk/login.php?redir=" + location.pathname}>Go to login</a>
    </div>
{/if}
<nav style="margin-bottom: 2rem;">
    <a href={`${BASEPATH}/`}>Welcome Guide</a>
    <a href={`${BASEPATH}/conti`}>Add account</a>
    <a href={`${BASEPATH}/buste`}>Envelopes/Budget</a>
    &bull; Transactions: 
    {#each $conti as conto}
    <a href={`${BASEPATH}/trasferimenti/${conto.id}`}><b>{conto.nome}</b></a>&nbsp;
    {/each}
</nav>

<slot></slot>

{#if $appState.authState != "authorized"}
<div style="text-align: center">
    <button class="login" on:click={login}>Login</button><br/>
    <span style="font-style: italic; font-size: 1.2rem;">&mldr; to syncronize across devices.</span><br>
</div>
{/if}

<Debug>
    <div style="margin-top: 100px;">
        <button on:click={resetApp}>Reset</button>
    </div>
</Debug>

<style>
    button.login {
        font-size: 32px;
        padding: 0.5rem;
        color: white;
        background-color: rgb(44, 106, 251);
        border: 2px solid rgb(24, 81, 213); 
        border-radius: 0.3rem;
        box-shadow: 0 2px 2px black;
    }
    button.login:hover {
        background-color: rgb(30, 96, 249);
        box-shadow: 0 3px 3px black;
    }

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