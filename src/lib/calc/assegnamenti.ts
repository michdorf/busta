import type { BustaT } from "$lib/stato/buste";
import { derived, get } from "svelte/store";
import buste from "$lib/stato/buste";
import { calcActivity } from "./activity";
import appState from "$lib/stato/app-state";
import { primoDelMese, toISOstr } from "$lib/date";

/**
 * Nota bene: assegnamenti sono precedenti solo
 * @param busta 
 * @returns 
 */
export function calcAssegnamenti(busta?: BustaT) {
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
            $busta.assegnamenti.map(($assegnamento) => {
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

export function calcRolloverAssegnamenti(busta?: BustaT) {
    let activity = calcActivity(typeof busta != "undefined" ? ($trasferimento) => $trasferimento.busta === busta.id : () => true);
    return derived([calcAssegnamenti(busta), activity], ([$assegnamenti, $activity]) => {
        return $assegnamenti.precedente - $activity.precedente;
    });
}