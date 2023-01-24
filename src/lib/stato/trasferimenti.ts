import { writable } from "svelte/store";
import type Ammonta from "../interfacce/ammonta";
import type { UUID_T } from "moduli/moduli/uuid";

export interface Trasferimento {
    id: UUID_T;
    contoId: UUID_T; /* conto id */
    payee: string;
    memo: string;
    amount: Ammonta;
    data: string; /* ISO date string */
    busta: UUID_T | null; /* busta id */
    cleared: boolean;
}

let trasferimenti = writable<Trasferimento[]>([]);

export default trasferimenti;