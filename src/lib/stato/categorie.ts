import { get, writable } from "svelte/store";


export interface Categoria {
    id: string;
    archived: boolean;
    nome: string;
}

let categorie = writable<Categoria[]>([]);

export function nuovaCategoria(): Categoria {
    return {
        id: "-1",
        archived: false,
        nome: "",
    }
}

export function archiveCategoria(categoriaId: string) {
    categorie.update(cs => {
        return cs.map($cat => {
            if ($cat.id === categoriaId) {
                $cat.archived = true;
            }
            return $cat;
        })
    })
}

export function getBusta(categoriaId: string) {
    return get(categorie).filter((categorie) => categorie.id == categoriaId)[0];
}

export default categorie;