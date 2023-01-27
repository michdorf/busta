import type Ricorrente from "moduli/moduli/ricorrente";

interface TargetBase {
    target: number;
    tipo: 'saving' | 'spending';
}

export interface SpendingTarget extends TargetBase {
    tipo: 'spending';
    ripeti: Ricorrente;
    prossima: string;
}

export interface SavingTarget extends TargetBase {
    tipo: 'saving';
    deadlineAbil: boolean;
    deadline: string; /* ISO string */
}