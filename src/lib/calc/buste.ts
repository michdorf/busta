import { primoDelMese, ultimoDelMese } from "$lib/date";
import appState from "$lib/stato/app-state";
import type { BustaT } from "$lib/stato/buste";
import trasferimenti from "$lib/stato/trasferimenti";
import { derived, get } from "svelte/store";

export function calcActivity(busta: BustaT) {
    const mese = get(appState).meseSelez;
    const precedenteD = primoDelMese(mese).getTime();
    const prossimaD = new Date(mese.getFullYear(), mese.getMonth()+1, 1).getTime();

    let precAmonta = 0;
    let corrAmonta = 0;
    let futurAmonta = 0;
    return derived(trasferimenti, ($trasferimenti) => {
        $trasferimenti.map(($trasf) => {
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