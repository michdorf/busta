<script lang="ts">
import type { UUID_T } from "moduli/moduli/uuid";
import buste, { nuovaBusta as genBusta, type Busta } from "$lib/stato/buste";
	import { salvaWritable } from "$lib/salvabile";

export let value: UUID_T | null;

let aggiungi = false;
let nuovaBusta: Busta = genBusta();
function onChange() {
    if (value == "agg") {
        aggiungi = true;
        value = null;
    } else {
        aggiungi = false;
    }
}

function salvaBusta() {
    salvaWritable(nuovaBusta, buste);
    console.log($buste);

    aggiungi = false;
}
</script>

{#if aggiungi}
<div class="modal">
    <h3 style="margin:0;padding:0">Aggiungi busta</h3>
    <div style="float: right" on:click={() => {aggiungi = false}}>X</div>
    <form on:submit|preventDefault={salvaBusta}>
        <label for="nome">Nome</label>
        <input bind:value={nuovaBusta.nome} placeholder="Nome della busta" /><br>
        <button type="submit">Salva</button>
    </form>
</div>
{/if}

<select bind:value={value} on:change={onChange}>
    <option value="" disabled>Buste</option>
    {#each $buste as busta}
        <option value={busta.id}>{busta.nome} {(busta.target - busta.assegnato)}</option>
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