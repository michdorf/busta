import { monthsDiff, primoDelMese } from "$lib/date";
import { roundAmount } from "$lib/numeri";
import Ricorrente from "moduli/moduli/ricorrente";
import appState from "$lib/stato/app-state";
import type { BustaT } from "$lib/stato/buste";
import { derived, get, readable, type Readable } from "svelte/store";
import buste from "$lib/stato/buste";

export function calcAssegnamenti(busta?: BustaT) {
    return derived(buste, ($buste) => {
        let bs: BustaT[];
        if (typeof busta !== "undefined") {
            bs = $buste.filter(($busta) => {
                return busta.id == $busta.id
            });
        } else {
            bs = $buste;
        }

        return bs.reduce((prev, cur) => prev + cur.assegnamenti.reduce((pr, cr) => {
            return pr + cr[1];
        }, 0), 0);
    });
}

export function numMesi(busta: BustaT) {
    return derived(appState, ($appState) => {
        let finMese: Date = new Date();

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
    });
}

export function calcTargetXMese(busta: BustaT, activity: Readable<{
    precedente: number;
    corrente: number;
    futuro: number;
}>) {
    return derived([activity, numMesi(busta)], ([$activity,$numMesi]) => {
        if (!busta.targetAbilitato) {
            return 0;
        }
    
        let result = 0;
    
        if (busta.target.tipo == 'spending') {
            result = busta.target.target / $numMesi;
        } else {
            result = (busta.target.target - $activity.precedente) / $numMesi;
        }
    
        return roundAmount(result);
    });
}