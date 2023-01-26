import { get, writable } from "svelte/store";
import Ricorrente from 'moduli/moduli/ricorrente'
import type { SpendingTarget, SavingTarget } from "../interfacce/target";

interface BustaBase {
    id: string;
    nome: string;
    categoria: string;
    precAmonta: number; /* ammonta dal mese precedente (balance + assegnato) */
    assegnato: number;
    targetAbilitato: boolean;
    target: SpendingTarget | SavingTarget;
    creato: Date;
}
export interface SpendingBusta extends BustaBase {
    target: SpendingTarget;
}
export interface SavingBusta extends BustaBase {
    target: SavingTarget;
}
export type BustaT = SavingBusta | SpendingBusta;

let buste = writable<Array<SpendingBusta | SavingBusta>>([]);

export function nuovaBusta(): SpendingBusta {
    return {
        id: "-1",
        nome: "",
        precAmonta: 0,
        assegnato: 0,
        categoria: "",
        targetAbilitato: false,
        target: {
            target: 0,
            tipo: 'spending',
            ripeti: new Ricorrente('m', 1, new Date()),
        },
        creato: new Date()
    }
}

export function bustaTipo(busta: BustaT) {
    return 'ripeti' in busta.target ? 'spending' : 'saving';
}

export function getBusta(bustaId: string) {
    return get(buste).filter((busta) => busta.id == bustaId)[0];
}

export default buste;