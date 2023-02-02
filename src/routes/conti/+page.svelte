<script lang="ts">
    import { page } from "$app/stores";
	import AmmontaInput from "$lib/c/ammonta-input.svelte";
	import ContiLista from "$lib/c/conti-lista.svelte";
    import conti, { getConto, nuovoConto, type Conto } from "$lib/stato/conti";
    import { salvaWritable } from '$lib/salvabile';
	import trasferimenti, { nuovoTransferimento } from "$lib/stato/trasferimenti";

    let conto: Conto = nuovoConto();
    let balance = 0;
    const contoId = $page.params.contoId || undefined;
    if (typeof contoId != "undefined") {
        conto = getConto(contoId); /* used in ./[contoId]/+page.svelte */
    }

    function salva() {
        let contoID = salvaWritable(conto, conti);
        let trasIniz = nuovoTransferimento(contoID);
        trasIniz.amount = balance;
        trasIniz.memo = "Initial balancing";
        trasIniz.payee = "Auto generated";
        salvaWritable(trasIniz, trasferimenti)
    }
</script>

<h1>{contoId ? "Edit " : "Create an"} account</h1>

<form>
    {#if typeof conto == "undefined"}
    <h1 style="color: red">Error. No account with id {$page.params.contoId}</h1>
    {:else}
    <label for="nome">Account name</label>
    <input id="nome" bind:value={conto.nome} /><br/>

    <label for="note">Note</label>
    <input id="note"  bind:value={conto.note}/><br/>

    <label for="balance">Initial balance</label>
    <AmmontaInput bind:value={balance} /><br/>

    <button on:click={salva}>Save</button>
    {/if}
</form><br>

<div style="background-color: aliceblue; padding: 1rem">
    <ContiLista></ContiLista>
</div>