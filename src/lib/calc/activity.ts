import { inPeriodo, monthsDiff, primoDelMese } from "$lib/date";
import { roundAmount } from "$lib/numeri";
import Ricorrente from "../../moduli/moduli/ricorrente";
import appState from "$lib/stato/app-state";
import type { BustaT } from "$lib/stato/buste";
import trasferimenti, { type Trasferimento } from "$lib/stato/trasferimenti";
import { derived, type Readable } from "svelte/store";
import { calcAssegnamenti, calcAssegnamentiPeriodo } from "./assegnamenti";

export interface ActivityT {
    finora: number;
    precedente: number;
    delmese: number;
    futuro: number;
}

export function calcActivity(filter: (trasferimento: Trasferimento) => boolean = () => true) {
    return derived([trasferimenti, appState], ([$trasferimenti, $appState]): ActivityT => {
        const mese = $appState.meseSelez;
        const precedenteD = primoDelMese(mese).getTime();
        const prossimaD = new Date(mese.getFullYear(), mese.getMonth()+1, 1).getTime();
    
        let precAmonta = 0;
        let corrAmonta = 0;
        let futurAmonta = 0;
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
            finora: corrAmonta + precAmonta,
            precedente: precAmonta,
            delmese: corrAmonta,
            futuro: futurAmonta
        }
    });
}

export function calcActivityPeriodo(filter: (trasferimento: Trasferimento) => boolean, daDStr: Date | null, finoaDStr: Date | null) {
    return calcActivity(($trasf) => filter($trasf) && (daDStr && finoaDStr ? inPeriodo($trasf.data, finoaDStr, daDStr) : true));
}

export function calcReddito(busta?: BustaT) {
    return calcActivity(typeof busta === "undefined" ? ($trasf) => $trasf.amount > 0 : ($trasf) => $trasf.amount > 0 && $trasf.busta == busta.id);
}

export function numMesi(busta: BustaT) {
    return derived(appState, ($appState) => {
        let finMese: Date = new Date();

        if (busta.target.tipo == 'spending' && 'ripeti' in busta.target) {
            busta.target.ripeti.primoGiorno = typeof busta.target.ripeti.primoGiorno == "string" ? new Date(busta.target.ripeti.primoGiorno) : busta.target.ripeti.primoGiorno;

            let giornoOffset = new Date($appState.meseSelez.getTime()); // Clona (forse aggiungi a ricorrente TODO)
            finMese = Ricorrente.prossima(busta.target.ripeti, giornoOffset);
            // console.table({riccorente: busta.target.ripeti, prossima: finMese})
        } else if ('deadline' in busta.target) {
            if (busta.target.deadlineAbil) {
                finMese = new Date(busta.target.deadline);
            } else {
                finMese = $appState.meseSelez;
            }
        }

        return monthsDiff($appState.meseSelez, finMese)/* + 1*/; // Jeg t??ller kun til og ikke med deadline-m??neden
    });
}

export function calcTargetXMese(busta: BustaT, periodo?: {da: Date, a: Date}/*, assegnamenti: Readable<ActivityT>, activity: Readable<ActivityT>*/) {
    let assegnamenti = periodo ? calcAssegnamentiPeriodo(periodo, busta) : calcAssegnamenti(busta);
    const filter = ($trasf: Trasferimento) => $trasf.busta === busta.id;
    let activity = periodo ? calcActivityPeriodo(filter, periodo.da, periodo.a) : calcActivity(filter);
    
    return derived([activity, numMesi(busta), assegnamenti], ([$activity,$numMesi, $assegnamenti]) => {
        if (!busta.targetAbilitato) {
            return 0;
        }
    
        let result = 0;
        if ($numMesi == 0) {
            $numMesi = 1; // Overvej at regne/dele ud over antal dage
        }
        if (busta.target.tipo == 'spending') {
            result = (busta.target.target - $assegnamenti.precedente) / $numMesi;
        } else {
            result = (busta.target.target - $activity.finora - $assegnamenti.precedente) / $numMesi;
        }
    
        return roundAmount(result);
    });
}