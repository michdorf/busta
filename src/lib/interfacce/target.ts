import type RicorrenteT from "../../../moduli/moduli/ricorrente";
import type { ISOstr } from "./ISOstr";

interface TargetBase {
    target: number;
    tipo: 'saving' | 'spending';
}

export interface SpendingTarget extends TargetBase {
    tipo: 'spending';
    ripeti: RicorrenteT;
    prossima: string;
}

export interface SavingTarget extends TargetBase {
    tipo: 'saving';
    deadlineAbil: boolean;
    deadline: ISOstr; /* ISO string */
}