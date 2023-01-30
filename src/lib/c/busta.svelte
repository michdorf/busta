<script lang="ts">
	import { calcActivity, calcTargetXMese } from "$lib/calc/activity";
	import { calcAssegnamentiPrec } from "$lib/calc/assegnamenti";
	import { salvaWritable } from "$lib/salvabile";
	import type { BustaT } from "$lib/stato/buste";
	import buste from "$lib/stato/buste";
	import AmmontaInput from "./ammonta-input.svelte";
	import Amonta from "./amonta.svelte";
	import CategoriaSelect from "./categoria-select.svelte";
	import TargetAzzera from "./target-azzera.svelte";
	import TargetSummary from "./target-summary.svelte";
    import ProgressBar from '$lib/c/progress-bar.svelte';

    export let busta: BustaT;
    
    $: activity = calcActivity(($trasf) => busta.id == $trasf.busta);
    $: targetXmese = calcTargetXMese(busta, activity);
    $: assegnamentiPrec = calcAssegnamentiPrec(busta);
    $: available = busta.assegnato + $assegnamentiPrec + $activity.finora;
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
        <div>
            <AmmontaInput bind:value={busta.assegnato} placeholder="Assegnato" /><br />
            <Amonta amonta={$assegnamentiPrec} /> prec.
        </div>
        <div title="Activity finora"><Amonta amonta={$activity.finora} /></div>
        <div class="available" class:overspent class:subtarget class:suptarget><Amonta amonta={available} /></div>
        <div><button type="submit">Salva</button></div>
        <TargetAzzera busta={busta} />
    </div>
</form><br>
<div><ProgressBar bilancio={busta.target.tipo === "saving" ? available : (busta.assegnato + $assegnamentiPrec)} max={busta.target.target} subtarget={subtarget} /></div>
<div style="text-align: right; background-color: color(srgb 0.8762 0.9402 0.99)">({busta.assegnato + $activity.delmese}[balance] + {$activity.precedente}[prec])</div>
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
        background-color: rgb(var(--silver));
        border-radius: 0.6em;
    }
    .available.suptarget {
        background-color: rgb(var(--green));
    }
    .available.overspent {
        background-color: rgb(var(--red));
    }
    .available.subtarget {
        background-color: rgb(var(--orange));
    }

    input {
        font-size: 1rem;
    }
</style>