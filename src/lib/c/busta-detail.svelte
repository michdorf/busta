<script lang="ts">
	import type { Busta } from "$lib/stato/buste";
	import { createEventDispatcher } from "svelte";
	import AmmontaInput from "./ammonta-input.svelte";
	import RicorrenteSelect from "./ricorrente-select.svelte";

    export let busta: Busta | undefined;

    let dispatch = createEventDispatcher<{salva: {busta: Busta}}>();
    function salva() {
        if (busta) {
            dispatch("salva", {busta});
            console.log(busta);
        }
    }
</script>

{#if busta}

<form on:submit|preventDefault={salva}>
    <label for="abilita">Abilita target</label>
    <input id="abilita" type="checkbox" bind:checked={busta.targetAbilitato} /><br />

    {#if busta.targetAbilitato}
    <label for="tipo">Tipo</label>
    <select bind:value={busta.target.tipo}>
        <option value="saving">Saving</option>
        <option value="spending">Spending</option>
    </select>
    <br>
    <label for="target">Quanto</label>
    <AmmontaInput id="target" bind:value={busta.target.target} /><br>
    <RicorrenteSelect bind:value={busta.ripeti} /><br>
    <br />
    {/if}
    <button type="submit">Salva</button>
</form>

{:else}
Nessuna busta selezionato
{/if}