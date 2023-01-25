import { get, writable } from "svelte/store";
import Ricorrente from 'moduli/moduli/ricorrente'
import type TargetT from "../interfacce/target";

export interface Busta {
    id: string;
    nome: string;
    categoria: string;
    assegnato: number;
    targetAbilitato: boolean;
    target: TargetT;
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
        targetAbilitato: false,
        target: {
            target: 0,
            tipo: 'spending'
        },
        ripeti: new Ricorrente('m', 1, new Date()),
        creato: new Date()
    }
}

export function getBusta(bustaId: string) {
    return get(buste).filter((busta) => busta.id == bustaId)[0];
}

export default buste;