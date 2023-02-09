<script lang="ts">
	import { numMesi } from "$lib/calc/activity";
	import { toISOstr } from "$lib/date";
	import { roundAmount } from "$lib/numeri";
	import type { BustaT } from "$lib/stato/buste";
	import Amonta from "./amonta.svelte";
	import Debug from "./debug.svelte";
    import Ricorrente from "moduli/moduli/ricorrente";

    export let available: number;
    export let busta: BustaT;
    export let attivitaPrec: number;
    export let targetXmese: number;
    export let assegnato: number;

    $: nnMesi = numMesi(busta);

    // $: targetXmese = calcTargetXMese(busta, attivitaPrec)
    $: mancaAlTarget = roundAmount(busta.target.tipo == "spending" ? targetXmese - assegnato : targetXmese - available);
</script>

<div>
    {#if mancaAlTarget == 0}
    You have reached your target
    {:else if mancaAlTarget < 0}
    You have surpassed your target with <Amonta amonta={mancaAlTarget * -1} />
    {:else}
    You still need to assign <Amonta amonta={mancaAlTarget} />
    {/if}
    (<Amonta amonta={targetXmese} /> each month for {$nnMesi} months)<Debug> for <strong>{busta.target.tipo}</strong>
    Attivita prec.: {attivitaPrec} &bull;
    #mesi: {$nnMesi} finMese: 
    {#if busta.target.tipo === 'spending'}
    {busta.target.prossima}&nbsp;
    {:else}
    {toISOstr(new Date())}&nbsp;
    {/if}
</Debug>
</div>