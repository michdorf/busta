<script lang="ts">
import { salvaWritable } from "$lib/salvabile";
import categorie, { nuovaCategoria as genCategoria, type Categoria } from "$lib/stato/categorie";

export let value: string | null;
export let placeholder = "";

let aggiungi = false;
let nuovaCategoria: Categoria = genCategoria();
function onChange() {
    if (value == "agg") {
        aggiungi = true;
        value = null;
    } else {
        aggiungi = false;
    }
}

function salvaCategoria() {
    salvaWritable(nuovaCategoria, categorie);
    console.log($categorie);

    aggiungi = false;
}
</script>

{#if aggiungi}
<div class="modal">
    <h3 style="margin:0;padding:0">Aggiungi categoria</h3>
    <div style="float: right" on:click={() => {aggiungi = false}}>X</div>
    <form on:submit|preventDefault={salvaCategoria}>
        <label for="nome">Nome</label>
        <input bind:value={nuovaCategoria.nome} placeholder="Nome della busta" /><br>
        <button type="submit">Salva</button>
    </form>
</div>
{/if}

<select bind:value={value} on:change={onChange}>
    <option value="" disabled>{placeholder}</option>
    {#each $categorie as categoria}
        <option value={categoria.id}>{categoria.nome}</option>
    {/each}
    <option value="agg">Aggiungi</option>
</select>

<style>
    .modal {
        position: absolute; 
        width: 248px; 
        top: 48px;
        left: calc(50vw - 124px);
        background-color: white;
        border: 1px solid black;
        padding: 8px;
    }
</style>