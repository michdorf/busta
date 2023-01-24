import type { Writable } from "svelte/store";
import uuid, { type UUID_T } from 'moduli/moduli/uuid';

export function salvaWritable<T>(daSalvare: T, writable: Writable<T[]>) {
    let essiste = false;

    if ((daSalvare as any).id) {
        writable.update((v) => {
            return v.map((_el) => {
                if ((_el as any).id == (daSalvare as any).id) {
                    essiste = true;
                    return daSalvare;
                } else {
                    return _el;
                }
            });
        });
    }

    if (!essiste) {
        writable.update((v) => {
            (daSalvare as any).id = uuid();
            return [...v, daSalvare];
        })
    }
}