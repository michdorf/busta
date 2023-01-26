<script lang="ts">
	import { monthsDiff } from "$lib/date";
	import { roundAmount } from "$lib/numeri";
	import { salvaWritable } from "$lib/salvabile";
	import appState from "$lib/stato/app";
	import type { BustaT, SavingBusta, SpendingBusta } from "$lib/stato/buste";
	import buste from "$lib/stato/buste";
	import Trasferimenti from "$lib/stato/trasferimenti";
	import Ricorrente from "moduli/moduli/ricorrente";
	import AmmontaInput from "./ammonta-input.svelte";
	import CategoriaSelect from "./categoria-select.svelte";
	import RicorrenteSelect from "./ricorrente-select.svelte";

    export let busta: BustaT;

    $: activity = $Trasferimenti.reduce((prev, cur) => {
        if (cur.busta == busta.id) {
            return prev + cur.amount;
        } else {
            return prev;
        }
    }, 0);
    $: available = busta.assegnato + activity;

    function calcXmeseSpending(busta: SpendingBusta) {
        let result = 0;
        let numMesi = 1;
        busta.target.ripeti.primoGiorno = typeof busta.target.ripeti.primoGiorno == "string" ? new Date(busta.target.ripeti.primoGiorno) : busta.target.ripeti.primoGiorno;
        numMesi = monthsDiff($appState.meseSelez, Ricorrente.prossima(busta.target.ripeti)) + 1;

        console.table({numMesi,primoGiorno: busta.target.ripeti.primoGiorno, prossimo: Ricorrente.prossima(busta.target.ripeti), intervalloN: busta.target.ripeti.intervalloN, target: busta.target.target});

        result = busta.target.target / numMesi;
        return result;
    } 

    function calcXmeseSaving(busta: SavingBusta) {
        return 10;
    }

    function calcTargetXMese(busta: BustaT) {
        let result = 0;
        if (!busta.targetAbilitato) {
            return 0;
        }

        if (busta.target.tipo == 'spending') {
            result = calcXmeseSpending(busta as SpendingBusta);
        } else {
            result = calcXmeseSaving(busta as SavingBusta);
        }

        return roundAmount(result);
    }

    $: targetXmese = calcTargetXMese(busta)
    $: mancaAlTarget = roundAmount(busta.target.tipo == "spending" ? targetXmese - busta.assegnato : targetXmese - available);

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
        <div><b>{available}</b></div>
        <div><button type="submit">Salva</button></div>
    </div>
</form><br>
<div>
    {#if busta.target.tipo === "saving"}
        {#if mancaAlTarget == 0}
        Hai raggiunto il target
        {:else if mancaAlTarget < 0}
        Hai superato il target di {mancaAlTarget * -1} 
        {:else}
        Manchi ancora {mancaAlTarget}
        {/if}
        ({targetXmese} ogni mese) per {busta.target.tipo}
    {:else}
        Spending x mese: {targetXmese} activity: {activity} e assegnato {busta.assegnato}.
    {/if}
</div>
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