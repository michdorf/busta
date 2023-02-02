<script lang="ts">
import { salvaWritable } from "$lib/salvabile";
import categorie, { nuovaCategoria as genCategoria, type Categoria } from "$lib/stato/categorie";

export let value: string | null;
export let placeholder = "Select category";

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
    <h3 style="margin:0;padding:0">Add category</h3>
    <button style="float: right" on:click={() => {aggiungi = false}}>X</button>
    <form on:submit|preventDefault={salvaCategoria}>
        <label for="nome">Name</label>
        <input bind:value={nuovaCategoria.nome} placeholder="Name of envelope" /><br>
        <button type="submit">Save</button>
    </form>
</div>
{/if}

<select bind:value={value} on:change={onChange}>
    <option value="" disabled>{placeholder}</option>
    {#each $categorie as categoria}
        <option value={categoria.id}>{categoria.nome}</option>
    {/each}
    <option value="agg">Add</option>
</select>

<style>
    .modal {
        position: absolute; 
        width: 248px; 
        top: 16px;
        left: 0;
        background-color: white;
        border: 1px solid black;
        padding: 8px;
    }
</style>