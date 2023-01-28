import { monthsDiff, primoDelMese } from "$lib/date";
import { roundAmount } from "$lib/numeri";
import Ricorrente from "moduli/moduli/ricorrente";
import appState from "$lib/stato/app-state";
import type { BustaT } from "$lib/stato/buste";
import trasferimenti, { type Trasferimento } from "$lib/stato/trasferimenti";
import { derived, get, type Readable } from "svelte/store";

export function calcActivity(filter: (trasferimento: Trasferimento) => boolean = () => true) {
    const mese = get(appState).meseSelez;
    const precedenteD = primoDelMese(mese).getTime();
    const prossimaD = new Date(mese.getFullYear(), mese.getMonth()+1, 1).getTime();

    let precAmonta = 0;
    let corrAmonta = 0;
    let futurAmonta = 0;
    return derived(trasferimenti, ($trasferimenti) => {
        $trasferimenti.map(($trasf) => {
            if (!filter($trasf)) {
                return;
            } 
            const corD = new Date($trasf.data).getTime();
            if (corD < precedenteD) {
                precAmonta += $trasf.amount;
            } else if (corD >= prossimaD) {
                futurAmonta += $trasf.amount;
            } else {
                corrAmonta += $trasf.amount;
            }
        });

        return {
            precedente: precAmonta,
            corrente: corrAmonta,
            futuro: futurAmonta
        }
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