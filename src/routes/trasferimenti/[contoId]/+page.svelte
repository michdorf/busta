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
    function initialTras() {
        return nuovoTransferimento(contoId);
    }
    let trasInEdita = initialTras();
    $: saldo = trasferimenti.reduce((prev, cur) => prev + cur.amount, 0);

    function salva(event: CustomEvent<{trasferimento:TrasferimentoT}>) {
        if (event.detail.trasferimento.id == "") {
            trasInEdita = initialTras();
        }
        salvaWritable(event.detail.trasferimento, trasferimentiStato);
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
{#if trasferimenti.length < 1}
<h3>Ingen overførsler</h3>
{:else}
    {#each trasferimenti as trasferimento (trasferimento.id)}
        <Trasferimento trasferimento={trasferimento} on:salva={salva} on:elimina={elimina}></Trasferimento>
    {/each}
{/if}

<Trasferimento trasferimento={trasInEdita} on:salva={salva}></Trasferimento>