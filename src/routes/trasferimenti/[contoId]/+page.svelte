<script lang="ts">
    import {page} from '$app/stores'
	import Trasferimento from '$lib/c/trasferimento.svelte';
	import { salvaWritable } from '$lib/salvabile';
	import { getConto } from '$lib/stato/conti';
	import trasferimentiStato, {type Trasferimento as TrasferimentoT} from '$lib/stato/trasferimenti';

    const contoId = $page.params.contoId;
    const conto = getConto(contoId);
    $: trasferimenti = ($trasferimentiStato as TrasferimentoT[]).filter(v => v.contoId == contoId);
    function initialTras() {
        return {
            id: "",
            contoId: contoId, /* conto id */
            payee: "",
            memo: "",
            amount: 0,
            data: toISOstr(new Date()),
            busta: null, /* busta id */
            cleared: false
        };
    }
    let trasInEdita = initialTras();

    function toISOstr(d: Date) {
        return d.toISOString().split('T')[0];
    }

    function salva(event: CustomEvent<{trasferimento:TrasferimentoT}>) {
        salvaWritable(event.detail.trasferimento, trasferimentiStato);
        trasInEdita = initialTras();
    }
</script>
<h1>Trasferimenti di {conto ? conto.nome : ''}</h1>
{#if trasferimenti.length < 1}
<h3>Ingen overførsler</h3>
{:else}
    {#each trasferimenti as trasferimento (trasferimento.id)}
        <Trasferimento trasferimento={trasferimento} on:salva={salva}></Trasferimento>
    {/each}
{/if}

<Trasferimento trasferimento={trasInEdita} on:salva={salva}></Trasferimento>