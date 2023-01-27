<script lang="ts">
	import { calcActivity } from "$lib/calc/buste";
	import { salvaWritable } from "$lib/salvabile";
	import type { BustaT } from "$lib/stato/buste";
	import buste from "$lib/stato/buste";
	import AmmontaInput from "./ammonta-input.svelte";
	import CategoriaSelect from "./categoria-select.svelte";
	import TargetSummary from "./target-summary.svelte";

    export let busta: BustaT;
    
    $: activity = calcActivity(busta);
    $: available = busta.assegnato + $activity.corrente + $activity.precedente;

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
        <div>{activity}</div>
        <div><b>{available}</b> ({busta.assegnato + $activity.corrente}[balance] - {$activity.precedente}[prec])</div>
        <div><button type="submit">Salva</button></div>
    </div>
</form><br>
<TargetSummary busta={busta} activity={$activity.corrente} attivitaPrec={$activity.precedente} available={available}  />
</div>

<style>
    .busta-cont {
        display: flex;
    }

    .busta-cont > div {
        padding: 0 0.4rem;
        border-left: 1px solid black;
    }
</style>