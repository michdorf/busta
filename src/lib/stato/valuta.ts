import type { Valuta } from "$lib/interfacce/ammonta";
import { writable } from "svelte/store";

let stdValuta = writable<Valuta>("dkk");
export default stdValuta;