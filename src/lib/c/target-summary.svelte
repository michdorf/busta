<script lang="ts">
	import { monthsDiff, primoDelMese, toISOstr } from "$lib/date";
	import { roundAmount } from "$lib/numeri";
	import appState from "$lib/stato/app-state";
	import type { BustaT } from "$lib/stato/buste";
	import Ricorrente from "moduli/moduli/ricorrente";

    export let activity: number;
    export let available: number;
    export let busta: BustaT;

    $: nMesi = numMesi(busta);
    let finMese = new Date();

    function numMesi(busta: BustaT) {
        // debugger;
        // let finMese: Date = new Date();

        if (busta.target.tipo == 'spending' && 'ripeti' in busta.target) {
            busta.target.ripeti.primoGiorno = typeof busta.target.ripeti.primoGiorno == "string" ? new Date(busta.target.ripeti.primoGiorno) : busta.target.ripeti.primoGiorno;
            finMese = Ricorrente.prossima(busta.target.ripeti);
            console.table({riccorente: busta.target.ripeti, prossima: finMese})
        } else if ('deadline' in busta.target) {
            if (busta.target.deadlineAbil) {
                finMese = new Date(busta.target.deadline);
            } else {
                finMese = $appState.meseSelez;
            }
        }

        return monthsDiff(primoDelMese($appState.meseSelez), primoDelMese(finMese)) + (busta.target.tipo == 'saving' ? 1 : 0);
    }

    function calcTargetXMese(busta: BustaT) {
        if (!busta.targetAbilitato) {
            return 0;
        }

        let result = 0;
        let nMesi = numMesi(busta);

        if (true || busta.target.tipo == 'spending') {
            result = busta.target.target / nMesi;
        } else {
            result = (busta.target.target / nMesi) + activity;
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
    Hai superato il target di {mancaAlTarget * -1} 
    {:else}
    Manchi ancora {mancaAlTarget}
    {/if}
    ({targetXmese} ogni mese) per <strong>{busta.target.tipo}</strong>
    #mesi: {nMesi} finMese: {toISOstr(finMese)}
</div>