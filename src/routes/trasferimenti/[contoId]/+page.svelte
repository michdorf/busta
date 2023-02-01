<script lang="ts">
    import {page} from '$app/stores'
	import Amonta from '$lib/c/amonta.svelte';
	import CambiaMese from '$lib/c/cambia-mese.svelte';
	import Trasferimento from '$lib/c/trasferimento.svelte';
	import { calcActivity } from '$lib/calc/activity';
	import { eliminaWritable, salvaWritable } from '$lib/salvabile';
	import { getConto } from '$lib/stato/conti';
	import trasferimentiStato, {nuovoTransferimento, type Trasferimento as TrasferimentoT} from '$lib/stato/trasferimenti';

    $: contoId = $page.params.contoId;
    $: conto = getConto(contoId);
    $: trasferimenti = ($trasferimentiStato as TrasferimentoT[]).filter(v => v.contoId == contoId);
    $: filteredTras = trasferimenti.concat().filter(($trasf) => $trasf.contoId == contoId).sort((a, b) => (new Date(a.data)).getTime() - (new Date(b.data)).getTime()).reverse(); // Mantiene #1 prima di #2 se su stesso giorno

    function initialTras() {
        let cId = contoId || $page.params.contoId;
        return nuovoTransferimento(cId);
    }
    $: trasInEdita = initialTras();
    $: activity = calcActivity(($trasf) => $trasf.contoId == contoId);
    $: saldoCorrente = $activity.finora; // + $activity.delmese;

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
<CambiaMese />
<h1>Trasferimenti di {conto ? conto.nome : ''}</h1>
{JSON.stringify(trasInEdita)} trans in edita.
<h3><Amonta amonta={saldoCorrente} /></h3>
<h4>
    <Amonta amonta={$activity.precedente} /> precedente. <Amonta amonta={$activity.futuro} /> in futuro. 
</h4>
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