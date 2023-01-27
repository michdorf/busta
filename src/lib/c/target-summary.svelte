<script lang="ts">
	import { monthsDiff, primoDelMese, primoProssMese, toISOstr } from "$lib/date";
	import { roundAmount } from "$lib/numeri";
	import appState from "$lib/stato/app-state";
	import type { BustaT } from "$lib/stato/buste";
	import Ricorrente from "moduli/moduli/ricorrente";
	import Amonta from "./amonta.svelte";

    export let activity: number;
    export let available: number;
    export let busta: BustaT;
    export let attivitaPrec: number;

    $: nnMesi = numMesi(busta);
    let finMese = new Date();

    function numMesi(busta: BustaT) {
        // debugger;
        // let finMese: Date = new Date();

        if (busta.target.tipo == 'spending' && 'ripeti' in busta.target) {
            busta.target.ripeti.primoGiorno = typeof busta.target.ripeti.primoGiorno == "string" ? new Date(busta.target.ripeti.primoGiorno) : busta.target.ripeti.primoGiorno;

            let giornoOffset = new Date($appState.meseSelez.getTime()); // Clona (forse aggiungi a ricorrente TODO)
            finMese = Ricorrente.prossima(busta.target.ripeti, giornoOffset);
            console.table({riccorente: busta.target.ripeti, prossima: finMese})
        } else if ('deadline' in busta.target) {
            if (busta.target.deadlineAbil) {
                finMese = new Date(busta.target.deadline);
            } else {
                finMese = $appState.meseSelez;
            }
        }

        return monthsDiff($appState.meseSelez, finMese)/* + 1*/; // Jeg tæller kun til og ikke med deadline-måneden
    }

    function calcTargetXMese(busta: BustaT) {
        if (!busta.targetAbilitato) {
            return 0;
        }

        let result = 0;
        let nMesi = numMesi(busta);

        if (busta.target.tipo == 'spending') {
            result = busta.target.target / nMesi;
        } else {
            result = (busta.target.target - attivitaPrec) / nMesi;
        }

        return roundAmount(result);
    }

    $: targetXmese = calcTargetXMese(busta)
    $: mancaAlTarget = roundAmount(busta.target.tipo == "spending" ? targetXmese - busta.assegnato : targetXmese - available);
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
    #mesi: {nnMesi} finMese: 
    {#if busta.target.tipo == 'spending'}
    {busta.target.prossima}
    {:else}
    {toISOstr(finMese)}
    {/if}
</div>