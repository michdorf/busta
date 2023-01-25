<script lang="ts">
	import { monthsDiff } from "$lib/date";
	import { roundAmount } from "$lib/numeri";
	import { salvaWritable } from "$lib/salvabile";
	import appState from "$lib/stato/app";
	import type { Busta } from "$lib/stato/buste";
	import buste from "$lib/stato/buste";
	import Trasferimenti from "$lib/stato/trasferimenti";
	import Ricorrente from "moduli/moduli/ricorrente";
	import AmmontaInput from "./ammonta-input.svelte";
	import CategoriaSelect from "./categoria-select.svelte";

    export let busta: Busta;

    $: activity = $Trasferimenti.reduce((prev, cur) => {
        if (cur.busta == busta.id) {
            return prev + cur.amount;
        } else {
            return prev;
        }
    }, 0);
    $: available = busta.assegnato + activity;

    function calcTargetXMese(busta: Busta) {
        let result = 0;
        if (!busta.targetAbilitato) {
            return 0;
        }

        let numMesi = 1;
        if (busta.ripeti.intervallo == "a") {
            busta.ripeti.primoGiorno = typeof busta.ripeti.primoGiorno == "string" ? new Date(busta.ripeti.primoGiorno) : busta.ripeti.primoGiorno;
            numMesi = monthsDiff($appState.meseSelez, Ricorrente.prossima(busta.ripeti));
        }

        result = busta.target.target / numMesi;

        return roundAmount(result);
    }

    $: targetXmese = calcTargetXMese(busta)
    $: mancaAlTarget = roundAmount(busta.target.tipo == "spending" ? targetXmese - busta.assegnato : targetXmese - available);

    function salva() {
        salvaWritable(busta, buste);
    }
</script>

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
        Non si puo parlare del path, pero hai speso {activity} e assegnato {busta.assegnato}.
    {/if}
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