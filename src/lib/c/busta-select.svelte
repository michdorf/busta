<script lang="ts">
import buste, { nuovaBusta as genBusta, type BustaT } from "$lib/stato/buste";
import { salvaWritable } from "$lib/salvabile";
import CategoriaSelect from "$lib/c/categoria-select.svelte";
	import { derived } from "svelte/store";
	import categorie, { type Categoria } from "$lib/stato/categorie";

export let value: string | null = "--hdr-placeholder";

$: derivedBuste = derived([buste, categorie], ([$buste, $categorie]) => {
    let r: Array<{categoriaNome: string} & BustaT> = [];

    $categorie.map(($categoria) => {
        return $buste.filter($busta => !$busta.archived)
                .filter($busta => $busta.categoria === $categoria.id).map($busta => {
                    r.push(Object.assign({categoriaNome: $categoria.nome}, $busta));
                });
    });
    return r;
});

$: archivedBuste = $buste.filter($busta => $busta.archived).map($busta => {
    const categoria = $categorie.find($cat => $cat.id === $busta.categoria);
    return Object.assign({categoriaNome: categoria?.nome}, $busta);
});

let aggiungi = false;
let nuovaBusta: BustaT = genBusta();
function onChange() {
    if (value == "agg") {
        aggiungi = true;
        value = null;
    } else {
        aggiungi = false;
    }
}

function salvaBusta() {
    if (!nuovaBusta.categoria) {
        alert("It needs to be assigned a category");
        return;
    }
    salvaWritable(nuovaBusta, buste);

    aggiungi = false;
}
</script>

{#if aggiungi}
<div class="modal">
    <h3 style="margin:0;padding:0">Aggiungi busta</h3>
    <button style="float: right" on:click={() => {aggiungi = false}}>X</button>
    <form on:submit|preventDefault={salvaBusta}>
        <label for="nome">Nome</label>
        <input bind:value={nuovaBusta.nome} placeholder="Nome della busta" /><br>
        <label for="categoria">Categoria</label>
        <CategoriaSelect bind:value={nuovaBusta.categoria} placeholder="Categoria" /><br>
        <button type="submit">Salva</button>
    </form>
</div>
{/if}

<select bind:value={value} on:change={onChange}>
    <option value="--hdr-placeholder" disabled>Select an envelope</option>
    {#each $derivedBuste as busta}
        <option value={busta.id}>{busta.categoriaNome} - {busta.nome}</option>
    {/each}
    {#if archivedBuste.length}
    <optgroup label="Archived">
        {#each archivedBuste as busta}
            <option value={busta.id}>{busta.categoriaNome} - {busta.nome}</option>
        {/each}
    </optgroup>
    {/if}
    <option value="">Da asegnare</option>
    <option value="agg">Aggiungi</option>
</select>

<style>
    .modal {
        position: fixed; 
        width: 248px; 
        top: 48px;
        left: calc(50vw - 124px);
        background-color: white;
        border: 1px solid black;
        padding: 8px;
    }
</style>