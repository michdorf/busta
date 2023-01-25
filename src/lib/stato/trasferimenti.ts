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

export default trasferimenti;