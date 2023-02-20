import { get, writable } from "svelte/store";


export interface Categoria {
    id: string;
    nome: string;
}

let categorie = writable<Categoria[]>([]);

export function nuovaCategoria(): Categoria {
    return {
        id: "-1",
        nome: "",
    }
}

export function getBusta(categoriaId: string) {
    return get(categorie).filter((categorie) => categorie.id == categoriaId)[0];
}

export default categorie;