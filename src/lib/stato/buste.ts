import { get, writable } from "svelte/store";
import Ricorrente from 'moduli/moduli/ricorrente'
import type { Categoria } from "./categorie";

export interface Busta {
    id: string;
    nome: string;
    categoria: string;
    assegnato: number;
    target: number;
    ripeti: Ricorrente;
    creato: Date;
}

let buste = writable<Busta[]>([]);

export function nuovaBusta(): Busta {
    return {
        id: "-1",
        nome: "",
        assegnato: 0,
        categoria: "",
        target: 0,
        ripeti: new Ricorrente('m', 1, new Date()),
        creato: new Date()
    }
}

export function getBusta(bustaId: string) {
    return get(buste).filter((busta) => busta.id == bustaId)[0];
}

export default buste;