import stdValuta from "$lib/stato/valuta";
import { get } from "svelte/store";

export type Valuta = 'dkk' | 'eur';

type Ammonta = `${number}:${Valuta}`;

export function format(a: Ammonta) {
    return a.split(':')[0] + ' ' + (a.split(':')[1] || `${a} wasn't parsed correctly`);
}

export function parse(a: Ammonta): {stima: number, valuta: Valuta} {
    const splitted = a.split(":");
    return {
        stima: parseInt(splitted[0]),
        valuta: splitted[1] as Valuta
    }
}

export function toAmmonta(ammonta: number, valuta?: Valuta): Ammonta {
    let ammontaStr = parseFloat(`${ammonta}`.replace(/,/g, ".")); // Replace , with .
    valuta = valuta || get(stdValuta);
    return `${ammontaStr}:${valuta}`;
}

export default Ammonta;