<script lang="ts">
    import {page} from '$app/stores'
	import BustaSelect from '$lib/c/busta-select.svelte';
	import { toAmmonta } from '$lib/interfacce/ammonta';
	import { salvaWritable } from '$lib/salvabile';
	import { getConto } from '$lib/stato/conti';
	import trasferimentiStato, {type Trasferimento} from '$lib/stato/trasferimenti';

    const contoId = $page.params.contoId;
    const conto = getConto(contoId);
    $: trasferimenti = ($trasferimentiStato as Trasferimento[]).filter(v => v.contoId == contoId);

    let trasInEdita: Trasferimento = {
        id: "",
        contoId: contoId, /* conto id */
        payee: "",
        memo: "",
        amount: "0:dkk",
        data: toISOstr(new Date()),
        busta: null, /* busta id */
        cleared: false
    }

    let inflow = "";
    let outflow = "";

    function toISOstr(d: Date) {
        return d.toISOString().split('T')[0];
    }

    function preventInOutFlow(inorout: 'in' | 'out') {
        if (inorout == 'in' && outflow != "" && inflow != "") {
            outflow = "";
        } else if (inorout == 'out' && inflow != "" && outflow != "") {
            inflow = ""
        }
    }

    function salva() {
        trasInEdita.amount = toAmmonta(inflow != "" ? parseFloat(inflow) : -parseFloat(outflow));
        salvaWritable(trasInEdita, trasferimentiStato);
    }
</script>
<h1>Trasferimenti di {conto ? conto.nome : ''}</h1>
{#if trasferimenti.length < 1}
<h3>Ingen overførsler</h3>
{:else}
    {#each trasferimenti as trasferimento}
        <p>{trasferimento.data} {trasferimento.amount} {trasferimento.busta} {trasferimento.payee}</p>
    {/each}
{/if}

<form>
    <input name="date" type="date" bind:value={trasInEdita.data} placeholder="Data" />
    <input name="payee" bind:value={trasInEdita.payee} placeholder="Payee" />
    <BustaSelect bind:value={trasInEdita.busta}></BustaSelect>
    <input name="memo" bind:value={trasInEdita.memo} placeholder="Memo" />
    <input name="outflow" bind:value={outflow} type="number" step=".01" placeholder="Outflow" on:blur={() => preventInOutFlow('out')}/>
    <input name="inflow" bind:value={inflow} type="number" step=".01" placeholder="Inflow" on:blur={() => preventInOutFlow('in')} />

    <button on:click={salva}>Salva</button>
</form>