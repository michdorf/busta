import type Ammonta from "$lib/interfacce/ammonta";
import { toAmmonta } from "$lib/interfacce/ammonta";
import { get, writable } from "svelte/store";
import type { UUID_T } from 'moduli/moduli/uuid';


export interface Conto {
    id: UUID_T | "";
    nome: string;
    note: string;
    balance: Ammonta;
    creato: Date;
}

let conti = writable<Conto[]>([]);

export function nuovoConto(): Conto {
    return {
        id: "",
        nome: "",
        note: "",
        balance: toAmmonta(0,"dkk"),
        creato: new Date()
    }
}

export function getConto(contoId: UUID_T | string) {
    return get(conti).filter((conto) => conto.id == contoId)[0];
}

export default conti;