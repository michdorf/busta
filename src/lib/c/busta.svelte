<script lang="ts">
	import { calcActivity, calcTargetXMese } from "$lib/calc/activity";
	import { salvaWritable } from "$lib/salvabile";
	import type { BustaT } from "$lib/stato/buste";
	import buste from "$lib/stato/buste";
	import AmmontaInput from "./ammonta-input.svelte";
	import CategoriaSelect from "./categoria-select.svelte";
	import TargetSummary from "./target-summary.svelte";

    export let busta: BustaT;
    
    $: activity = calcActivity(busta);
    $: targetXmese = calcTargetXMese(busta, activity);
    $: available = busta.assegnato + $activity.corrente + $activity.precedente;
    $: overspent = available < 0;
    $: suptarget = (available > 0 && busta.assegnato > $targetXmese);
    $: subtarget = (!overspent && busta.assegnato < $targetXmese);

    function salva() {
        salvaWritable(busta, buste);
    }
</script>

<div style="background-color: aliceblue; margin: 0.4rem; padding: 0.6rem">
<form on:submit|preventDefault={salva}>
    <div class="busta-cont">
        <div style="flex: 1;"><input bind:value={busta.nome} /></div>
        <div><CategoriaSelect bind:value={busta.categoria} /></div>
        <div><AmmontaInput bind:value={busta.assegnato} placeholder="Assegnato" /></div>
        <div>{$activity.corrente}</div>
        <div class="available" class:overspent class:subtarget class:suptarget>{available}</div>
        <div><button type="submit">Salva</button></div>
    </div>
</form><br>
<div style="text-align: right; background-color: color(srgb 0.8762 0.9402 0.99)">({busta.assegnato + $activity.corrente}[balance] + {$activity.precedente}[prec])</div>
<TargetSummary busta={busta} targetXmese={$targetXmese} attivitaPrec={$activity.precedente} available={available} />
<div style="text-align: center;">Assegnamenti: {JSON.stringify(busta.assegnamenti)}</div>
</div>

<style>
    .busta-cont {
        display: flex;
    }

    .busta-cont > div {
        padding: 0 0.4rem;
        border-left: 1px solid black;
    }

    .available {
        font-weight: bold;
        background-color: rgb(219, 219, 219);
        border-radius: 0.6em;
    }
    .available.suptarget {
        background-color: #66cc5e;
    }
    .available.overspent {
        background-color: rgb(255, 122, 122);
    }
    .available.subtarget {
        background-color: #feae43;
    }

    input {
        font-size: 1rem;
    }
</style>