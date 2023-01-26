import { toISOstr } from "$lib/date";
import { writable } from "svelte/store";

export interface Trasferimento {
    id: string;
    contoId: string; /* conto id */
    payee: string;
    memo: string;
    amount: number;
    data: string; /* ISO date string */
    busta: string | null; /* busta id */
    cleared: boolean;
}

let trasferimenti = writable<Trasferimento[]>([]);

export function nuovoTransferimento(contoId: string) {
    return {
        id: "",
        contoId: contoId, /* conto id */
        payee: "",
        memo: "",
        amount: 0,
        data: toISOstr(new Date()),
        busta: null, /* busta id */
        cleared: false
    };
}

export default trasferimenti;