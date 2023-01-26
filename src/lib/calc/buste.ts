import type { BustaT } from "$lib/stato/buste";
import trasferimenti from "$lib/stato/trasferimenti";
import { get } from "svelte/store";

export function calcActivity(busta: BustaT) {
    return get(trasferimenti).reduce((prev, cur) => {
        if (cur.busta == busta.id) {
            return prev + cur.amount;
        } else {
            return prev;
        }
    }, 0);
}