<script lang="ts">
    import {page} from '$app/stores'
	import AmmontaInput from '$lib/c/ammonta-input.svelte';
	import BustaSelect from '$lib/c/busta-select.svelte';
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
        amount: 0,
        data: toISOstr(new Date()),
        busta: null, /* busta id */
        cleared: false
    }

    let inflow: number | undefined = undefined;
    let outflow: number | undefined = undefined;

    function toISOstr(d: Date) {
        return d.toISOString().split('T')[0];
    }

    function preventInOutFlow(inorout: 'in' | 'out') {
        const bothFilled = outflow && inflow;
        if (inorout == 'in' && bothFilled) {
            outflow = undefined;
        } else if (inorout == 'out' && bothFilled) {
            inflow = undefined;
        }
    }

    function salva() {
        trasInEdita.amount = inflow ? inflow : -(outflow || 0);
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
    <AmmontaInput name="outflow" bind:value={outflow} placeholder="Outflow" on:blur={() => preventInOutFlow('out')}/>
    <AmmontaInput name="inflow" bind:value={inflow} placeholder="Inflow" on:blur={() => preventInOutFlow('in')} />

    <button on:click={salva}>Salva</button>
</form>