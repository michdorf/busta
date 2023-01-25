import type { Writable } from "svelte/store";

interface WithId {
    id: string;
    [key: string]: any;
}

export function salvaWritable<T>(daSalvare: T, writable: Writable<T[]>) {
    let essiste = false;

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
        writable.update((v) => {
            let max = 0;
            v.forEach((e) => max = Math.max(max, parseInt((e as WithId).id)));
            (daSalvare as WithId).id = `${max + 1}`;
            return [...v, daSalvare];
        })
    }
}