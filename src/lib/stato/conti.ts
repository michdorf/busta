import { get, writable } from "svelte/store";

export interface Conto {
    id:  string;
    nome: string;
    note: string;
    balance: number;
    creato: Date;
}

let conti = writable<Conto[]>([]);

export function nuovoConto(): Conto {
    return {
        id: "",
        nome: "",
        note: "",
        balance: 0,
        creato: new Date()
    }
}

export function getConto(contoId: string) {
    return get(conti).filter((conto) => conto.id == contoId)[0];
}

export default conti;