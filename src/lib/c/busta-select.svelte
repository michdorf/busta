<script lang="ts">
import buste, { nuovaBusta as genBusta, type BustaT } from "$lib/stato/buste";
import { salvaWritable } from "$lib/salvabile";
import CategoriaSelect from "$lib/c/categoria-select.svelte";

export let value: string | null;

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
        alert("Deve avere una categoria");
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
    <option value="--hdr-placeholder" disabled>Buste</option>
    {#each $buste as busta}
        <option value={busta.id}>{busta.nome}</option>
    {/each}
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