import type { Writable } from "svelte/store";

interface WithId {
    id: string;
    [key: string]: any;
}

export let nuovaModifica = false;
export function setNuovaModifica(modifica: boolean) {
    nuovaModifica = modifica;
}

export function salvaWritable<T>(daSalvare: T, writable: Writable<T[]>) {
    let essiste = false;
    daSalvare = Object.assign({}, daSalvare);
    nuovaModifica = true;

    if ((daSalvare as any).id) {
        writable.update((v) => {
            return v.map((_el) => {
                if ((_el as WithId).id == (daSalvare as WithId).id) {
                    essiste = true;
                    return daSalvare;
                } else {
                    return _el;
                }
            });
        });
    }

    if (!essiste) {
        let nuovoId = '';
        writable.update((v) => {
            let max = 0;
            v.forEach((e) => max = Math.max(max, parseInt((e as WithId).id)));
            nuovoId = `${max + 1}`;
            (daSalvare as WithId).id = nuovoId;
            return [...v, daSalvare];
        });

        return nuovoId;
    } else {
        return (daSalvare as WithId).id;
    }
}

export function eliminaWritable<T>(daEliminare: T, writable: Writable<T[]>) {
    if ((daEliminare as any).id) {
        nuovaModifica = true;
        writable.update((v) => {
            return v.filter((_el) => {
                return (_el as WithId).id !== (daEliminare as WithId).id;
            });
        });
    }
}