<script lang="ts">
    import {page} from '$app/stores'
	import Trasferimento from '$lib/c/trasferimento.svelte';
	import { toISOstr } from '$lib/date';
	import { eliminaWritable, salvaWritable } from '$lib/salvabile';
	import { getConto } from '$lib/stato/conti';
	import trasferimentiStato, {nuovoTransferimento, type Trasferimento as TrasferimentoT} from '$lib/stato/trasferimenti';

    const contoId = $page.params.contoId;
    const conto = getConto(contoId);
    $: trasferimenti = ($trasferimentiStato as TrasferimentoT[]).filter(v => v.contoId == contoId);
    $: filteredTras = trasferimenti.concat().sort((a, b) => (new Date(a.data)).getTime() - (new Date(b.data)).getTime()).reverse(); // Mantiene #1 prima di #2 se su stesso giorno

    function initialTras() {
        return nuovoTransferimento(contoId);
    }
    let trasInEdita = initialTras();
    $: saldo = trasferimenti.reduce((prev, cur) => prev + cur.amount, 0);

    function salva(event: CustomEvent<{trasferimento:TrasferimentoT}>) {
        salvaWritable(event.detail.trasferimento, trasferimentiStato);

        if (event.detail.trasferimento.id == "") {
            trasInEdita = initialTras();
        }
    }

    function elimina(event: CustomEvent<{trasferimento:TrasferimentoT}>) {
        if (event.detail.trasferimento.id == "") {
            console.error("Richiede un id per eliminare");
            return;
        }
        eliminaWritable(event.detail.trasferimento, trasferimentiStato);
    }
</script>
<h1>Trasferimenti di {conto ? conto.nome : ''}</h1>
<h3>{saldo}</h3>
{#key trasInEdita.id}
<Trasferimento trasferimento={trasInEdita} on:salva={salva}></Trasferimento>
{/key}
{#if trasferimenti.length < 1}
<h3>Ingen overførsler</h3>
{:else}
    {#each filteredTras as trasferimento (trasferimento.id)}
        <span title={JSON.stringify(trasferimento)}><Trasferimento trasferimento={trasferimento} on:salva={salva} on:elimina={elimina}></Trasferimento></span>
    {/each}
{/if}