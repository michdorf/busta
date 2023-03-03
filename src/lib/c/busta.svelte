<script lang="ts">
	import { calcActivity, calcTargetXMese } from "$lib/calc/activity";
	import { calcAssegnamenti, calcRolloverAssegnamenti, setAssegnatoDelMese } from "$lib/calc/assegnamenti";
	import { salvaWritable } from "$lib/salvabile";
	import type { BustaT } from "$lib/stato/buste";
	import buste from "$lib/stato/buste";
	import AmmontaInput from "./ammonta-input.svelte";
	import Amonta from "./amonta.svelte";
	import CategoriaSelect from "./categoria-select.svelte";
	import Target from "./target.svelte";
	import { goto } from "$app/navigation";
	import { BASEPATH } from "$lib/base-path";
	import Ricorrente from "../../moduli/moduli/ricorrente";
	import appState from "$lib/stato/app-state";
	import { readable } from "svelte/store";
	import { roundAmount } from "$lib/numeri";
	import Debug from "./debug.svelte";
	import Dropmenu from "./dropmenu.svelte";
	import { createEventDispatcher } from "svelte";

    export let busta: BustaT;
    let dispatch = createEventDispatcher<{setTarget:boolean}>();
    $: ricorrente = busta.targetAbilitato && busta.target.tipo === "spending" ? busta.target.ripeti : undefined;
    $: periodo = ricorrente ? {
            da: Ricorrente.scorsa(ricorrente, $appState.meseSelez), 
            a: Ricorrente.prossima(ricorrente, $appState.meseSelez)
        } 
        : undefined;
    $: assegnamenti = ricorrente ? calcAssegnamenti/*Periodo*/(/*periodo, */busta) : calcAssegnamenti(busta);
    
    let daSalvare = false;
    $: activity = calcActivity/*Periodo*/(($trasf) => busta.id == $trasf.busta/*, periodo.da, periodo.a*/);
    $: rolloverAssegn = periodo && periodo.da ? calcRolloverAssegnamenti(busta, periodo.da) : readable(0);
    $: targetXmese = calcTargetXMese(busta, periodo);
    $: available = $assegnamenti.finora + $activity.finora;
    $: overspent = roundAmount(available) < 0;
    $: suptarget = (roundAmount(available) > 0 && $assegnamenti.delmese > $targetXmese);
    $: subtarget = (!overspent && $assegnamenti.delmese < $targetXmese);

    $: assegnamentoValue = $assegnamenti.delmese;

    function salva(assegnamento?: number) {
        busta = setAssegnatoDelMese(typeof assegnamento !== "undefined" ? assegnamento : assegnamentoValue, busta);
        salvaWritable(busta, buste);
        daSalvare = false;
    }
</script>

<div style="background-color: aliceblue; margin: 0.4rem; padding: 0.6rem">
<form on:submit|preventDefault={() => salva()}>
    <div style="float: right">
        <Dropmenu alignRight={true}>
            <button on:click={() => { goto(`${BASEPATH}/buste/trasferimenti/${busta.id}`) }}>
                Trasactions
            </button>
            <button on:click={() => { dispatch('setTarget', true) }}>
                Set target
            </button>
        </Dropmenu>
    </div>
    <div class="busta-cont">
        <div style="flex: 1;"><input bind:value={busta.nome} on:click|stopPropagation on:change={() => salva()} /></div>
        <div><CategoriaSelect bind:value={busta.categoria} on:change={() => daSalvare = true} /></div>
        <div>
            <AmmontaInput value={assegnamentoValue} on:change={(event) => {salva(event.detail)}} placeholder="Assign" /><br />
            <Debug><Amonta amonta={$assegnamenti.precedente} /> prev. ({roundAmount($rolloverAssegn)} rollover)</Debug>
        </div>
        <div title="Activity until now">
            <Amonta amonta={$activity.finora} />
        </div>
        <div class="available" class:overspent class:subtarget class:suptarget><Amonta amonta={available} /></div>
        <div>{#if daSalvare}<button type="submit" on:click|stopPropagation>Save</button>{/if}</div>
        <!--<TargetAzzera busta={busta} />-->
    </div>
</form><br>
<Target busta={busta} periodo={periodo} subtarget={subtarget} overspent={overspent} suptarget={suptarget} available={available} activity={activity} assegnamenti={assegnamenti} targetXmese={targetXmese}></Target>
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