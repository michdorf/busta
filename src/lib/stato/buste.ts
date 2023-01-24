import type Ammonta from "$lib/interfacce/ammonta";
import { toAmmonta } from "$lib/interfacce/ammonta";
import { get, writable } from "svelte/store";
import uuid, { type UUID_T } from 'moduli/moduli/uuid';
import Ricorrente from 'moduli/moduli/ricorrente'

interface Categoria {
    id: UUID_T;
    nome: string;
}

export interface Busta {
    id: UUID_T;
    nome: string;
    assegnato: number;
    target: number;
    ripeti: Ricorrente;
    creato: Date;
}

let buste = writable<Busta[]>([]);

export function nuovaBusta(): Busta {
    return {
        id: uuid(),
        nome: "",
        assegnato: 0,
        target: 0,
        ripeti: new Ricorrente('m', 1, new Date()),
        creato: new Date()
    }
}

export function getBusta(bustaId: UUID_T) {
    return get(buste).filter((busta) => busta.id == bustaId)[0];
}

export default buste;