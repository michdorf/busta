<script lang="ts">
	import { numMesi } from "$lib/calc/activity";
	import { toISOstr } from "$lib/date";
	import { roundAmount } from "$lib/numeri";
	import type { BustaT } from "$lib/stato/buste";
	import Amonta from "./amonta.svelte";

    export let available: number;
    export let busta: BustaT;
    export let attivitaPrec: number;
    export let targetXmese: number;
    export let assegnato: number;

    $: nnMesi = numMesi(busta);
    let finMese = new Date();

    // $: targetXmese = calcTargetXMese(busta, attivitaPrec)
    $: mancaAlTarget = roundAmount(busta.target.tipo == "spending" ? targetXmese - assegnato : targetXmese - available);
</script>

<div>
    {#if mancaAlTarget == 0}
    Hai raggiunto il target
    {:else if mancaAlTarget < 0}
    Hai superato il target di <Amonta amonta={mancaAlTarget * -1} />
    {:else}
    Manchi ancora <Amonta amonta={mancaAlTarget} />
    {/if}
    (<Amonta amonta={targetXmese} /> ogni mese) per <strong>{busta.target.tipo}</strong>
    Attivita prec.: {attivitaPrec} &bull;
    #mesi: {$nnMesi} finMese: 
    {#if busta.target.tipo == 'spending'}
    {busta.target.prossima}
    {:else}
    {toISOstr(finMese)}
    {/if}
</div>