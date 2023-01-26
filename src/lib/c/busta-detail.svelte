<script lang="ts">
	import { toISOstr } from "$lib/date";
	import  type { BustaT, SavingBusta, SpendingBusta } from "$lib/stato/buste";
	import Ricorrente from "moduli/moduli/ricorrente";
	import { createEventDispatcher } from "svelte";
	import AmmontaInput from "./ammonta-input.svelte";
	import RicorrenteSelect from "./ricorrente-select.svelte";

    export let busta: BustaT | undefined;

    let curBustaTipo = busta?.target.tipo;
    $: {
        if (busta?.target.tipo != curBustaTipo) {
            const oldBusta = busta;
            // Cambiato tipo - manipula data
            if (busta?.target.tipo == "saving") {
                busta = busta as SavingBusta;
                busta.target.deadline = busta.target.deadline || toISOstr((oldBusta as SpendingBusta).target.ripeti.primoGiorno);
                busta.target.deadlineAbil = busta.target.deadlineAbil || false;
                
                // Keep old values for easier recover
                // delete (busta as any).target.ripeti;
            } else {
                busta = busta as SpendingBusta;
                busta.target.ripeti = busta.target.ripeti || new Ricorrente('m',1,new Date((oldBusta as SavingBusta).target.deadline));
            }
        }
    }

    let dispatch = createEventDispatcher<{salva: {busta: BustaT}}>();
    function salva() {
        if (busta) {
            dispatch("salva", {busta});
            console.log(busta);
        }
    }
</script>

<div style="padding: 1rem; background-color: bisque; position: sticky; top: 1rem;">
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
    {#if busta.target.tipo == 'spending'}
    <RicorrenteSelect bind:value={busta.target.ripeti} /><br>
    {:else}
    <input id="deadlineAbil" type="checkbox" bind:checked={busta.target.deadlineAbil} />
    <label for="deadlineAbil">By date</label><br>
        {#if busta.target.deadlineAbil}
        <input type="date" bind:value={busta.target.deadline} />
        <br />
        {/if}
    {/if}
    <br />
    {/if}
    <button type="submit">Salva</button>
</form>

{:else}
Nessuna busta selezionato
{/if}
</div>