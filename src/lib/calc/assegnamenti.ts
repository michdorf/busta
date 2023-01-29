import type { BustaT } from "$lib/stato/buste";
import { derived } from "svelte/store";
import buste from "$lib/stato/buste";
import { calcActivity } from "./activity";

/**
 * Nota bene: assegnamenti sono precedenti solo
 * @param busta 
 * @returns 
 */
export function calcAssegnamentiPrec(busta?: BustaT) {
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

export function calcRolloverAssegnamenti(busta?: BustaT) {
    let activity = calcActivity(typeof busta != "undefined" ? ($trasferimento) => $trasferimento.busta === busta.id : () => true);
    return derived([calcAssegnamentiPrec(busta), activity], ([$assegnamenti, $activity]) => {
        return $assegnamenti - $activity.precedente;
    });
}