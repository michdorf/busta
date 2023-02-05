<script lang="ts">
	import { calcActivity, calcReddito, calcTargetXMese } from "$lib/calc/activity";
	import { calcAssegnamenti, setAssegnatoDelMese } from "$lib/calc/assegnamenti";
	import { salvaWritable } from "$lib/salvabile";
	import type { BustaT } from "$lib/stato/buste";
	import buste from "$lib/stato/buste";
	import AmmontaInput from "./ammonta-input.svelte";
	import Amonta from "./amonta.svelte";
	import CategoriaSelect from "./categoria-select.svelte";
	import TargetAzzera from "./target-azzera.svelte";
	import TargetSummary from "./target-summary.svelte";
    import ProgressBar from '$lib/c/progress-bar.svelte';
	import { goto } from "$app/navigation";
	import { BASEPATH } from "$lib/base-path";
	import Debug from "./debug.svelte";

    export let busta: BustaT;
    let assegnamenti = calcAssegnamenti(busta);
    
    $: activity = calcActivity(($trasf) => busta.id == $trasf.busta);
    $: reddito = calcReddito(busta);
    $: targetXmese = calcTargetXMese(busta, activity);
    $: available = $assegnamenti.finora + $activity.finora;
    $: overspent = available < 0;
    $: suptarget = (available > 0 && $assegnamenti.delmese > $targetXmese);
    $: subtarget = (!overspent && $assegnamenti.delmese < $targetXmese);

    let assegnamentoValue = 0;
    assegnamenti.subscribe((ass) => {
        assegnamentoValue = ass.delmese;
    });

    function salva() {
        busta = setAssegnatoDelMese(assegnamentoValue, busta);
        salvaWritable(busta, buste);
    }
</script>

<div style="background-color: aliceblue; margin: 0.4rem; padding: 0.6rem">
<form on:submit|preventDefault={salva}>
    <div class="busta-cont">
        <div style="flex: 1;"><input bind:value={busta.nome} /></div>
        <div><CategoriaSelect bind:value={busta.categoria} /></div>
        <div>
            <AmmontaInput bind:value={assegnamentoValue} placeholder="Assign" /><br />
            <Amonta amonta={$assegnamenti.precedente} /> prev.
        </div>
        <div title="Activity until now"><Amonta amonta={$activity.finora} /></div>
        <div class="available" class:overspent class:subtarget class:suptarget><Amonta amonta={available} /></div>
        <div><button type="submit">Save</button></div>
        <TargetAzzera busta={busta} />
        <button on:click={() => { goto(`${BASEPATH}/buste/trasferimenti/${busta.id}`) }}>Trasactions</button>
    </div>
</form><br>
<div><ProgressBar 
        bilancio={busta.target.tipo === "saving" ? available : available } 
        speso={busta.target.tipo === "spending" ? Math.min($activity.finora + available /*, available */) : 0} 
        max={busta.target.target || Math.abs($activity.finora)} subtarget={subtarget} /></div>
<Debug><div style="text-align: right; background-color: color(srgb 0.8762 0.9402 0.99)">(<Amonta amonta={$assegnamenti.delmese + $activity.delmese} />[balance] + <Amonta amonta={$activity.precedente} />[prec])</div></Debug>
<TargetSummary busta={busta} targetXmese={$targetXmese} assegnato={$assegnamenti.delmese} attivitaPrec={$activity.precedente} available={available} />
<Debug><div style="text-align: center;">Assegnamenti: {JSON.stringify(busta.assegnamenti)}</div></Debug>
</div>

<style>
    .busta-cont {
        display: flex;
    }

    @media only screen and (max-width: 640px) {
        .busta-cont {
            display: initial;
        }
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