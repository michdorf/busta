import type { BustaT } from "$lib/stato/buste";
import { derived, get } from "svelte/store";
import buste from "$lib/stato/buste";
import { calcActivity, calcReddito } from "./activity";
import appState from "$lib/stato/app-state";
import { inPeriodo, primoDelMese, toISOstr } from "$lib/date";
import type {ISOstr} from "../interfacce/ISOstr";

/**
 * Nota bene: assegnamenti sono precedenti solo
 * @param busta 
 * @returns 
 */
export function calcAssegnamenti(busta?: BustaT, periodo?: {da: Date | null, a: Date | null}) {
    return derived([appState, buste], ([$appState, $buste]) => {
        let bs: BustaT[];
        if (typeof busta !== "undefined") {
            bs = $buste.filter(($busta) => {
                return busta.id == $busta.id
            });
        } else {
            bs = $buste;
        }

        /* return bs.reduce((prev, cur) => prev + cur.assegnamenti.reduce((pr, cr) => {
            return pr + cr[1];
        }, 0), 0); */
        const mese = $appState.meseSelez;
        const precedenteD = primoDelMese(mese).getTime();
        const prossimaD = new Date(mese.getFullYear(), mese.getMonth()+1, 1).getTime();

        let precAmonta = 0;
        let corrAmonta = 0;
        let futurAmonta = 0;
        bs.map(($busta) => {
            let assegnFiltrati = [...$busta.assegnamenti]/* clone */;
            if (periodo?.da && periodo?.a) {
                let da = periodo.da;
                let a = periodo.a;
                assegnFiltrati = $busta.assegnamenti.filter(($assegnamento) => {
                   return inPeriodo($assegnamento[0], da, a)
                });
            } 
            assegnFiltrati.map(($assegnamento) => {
                const corD = new Date($assegnamento[0]).getTime();
                if (corD < precedenteD) {
                    precAmonta += $assegnamento[1];
                } else if (corD >= prossimaD) {
                    futurAmonta += $assegnamento[1];
                } else {
                    corrAmonta += $assegnamento[1];
                }
            }
            );
        })
        return {
            finora: corrAmonta + precAmonta,
            precedente: precAmonta,
            delmese: corrAmonta,
            futuro: futurAmonta
        }
    });
}

export function calcAssegnamentiPeriodo(periodo: {da: Date | null, a: Date | null}, busta?: BustaT) {
    return calcAssegnamenti(busta, periodo);
}

export function setAssegnatoDelMese(assegnato: number, busta: BustaT) {
    let meseSelezStr = toISOstr(get(appState).meseSelez);
    let trovato = false;
    busta.assegnamenti = busta.assegnamenti.map((assegnamento) => {
        if (meseSelezStr.substring(0,7) === assegnamento[0].substring(0,7)) { // Stesso mese e anno
            assegnamento[0] = toISOstr(meseSelezStr);
            assegnamento[1] = assegnato;
            trovato = true;
        }
        return assegnamento;
    });
    if (!trovato) {
        busta.assegnamenti.push([toISOstr(meseSelezStr), assegnato]);
    }
    return busta;
}

export function calcRolloverAssegnabile() {
    let prontoPerAssegnamento = calcActivity(($trasf) => $trasf.amount > 0 && !$trasf.busta);
    return derived([calcAssegnamenti(), prontoPerAssegnamento], ([$assegnamenti, $prontoPerAssegnamento]) => {
        return $prontoPerAssegnamento.precedente - $assegnamenti.precedente;
    });
}

export function calcRolloverAssegnamenti(busta: BustaT) {
    let attivitaBusta = calcActivity(($trasf) => $trasf.busta === busta.id);
    return derived([calcAssegnamenti(busta), attivitaBusta], ([$assegnamenti, $attivitaBusta]) => {
        return $assegnamenti.precedente - $attivitaBusta.precedente;
    });
}