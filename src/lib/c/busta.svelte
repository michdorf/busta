<script lang="ts">
	import { salvaWritable } from "$lib/salvabile";
	import type { Busta } from "$lib/stato/buste";
	import buste from "$lib/stato/buste";
	import Trasferimenti from "$lib/stato/trasferimenti";
	import AmmontaInput from "./ammonta-input.svelte";
	import CategoriaSelect from "./categoria-select.svelte";

    export let busta: Busta;

    $: activity = $Trasferimenti.reduce((prev, cur) => {
        if (cur.busta == busta.id) {
            return prev + cur.amount;
        } else {
            return prev;
        }
    }, 0);
    $: available = busta.assegnato + activity;

    function salva() {
        salvaWritable(busta, buste);
    }
</script>

<form on:submit|preventDefault={salva}>
    <div class="busta-cont">
        <div style="flex: 1;"><input bind:value={busta.nome} /></div>
        <div><CategoriaSelect bind:value={busta.categoria} /></div>
        <div><AmmontaInput bind:value={busta.assegnato} placeholder="Assegnato" /></div>
        <div>{activity}</div>
        <div>{available}</div>
        <div><button type="submit">Salva</button></div>
    </div>
</form>

<style>
    .busta-cont {
        display: flex;
    }

    .busta-cont > div {
        padding: 0 0.4rem;
        border-left: 1px solid black;
    }
</style>