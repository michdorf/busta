<script lang="ts">
	import AmmontaInput from '$lib/c/ammonta-input.svelte';
	import BustaSelect from '$lib/c/busta-select.svelte';
	import type { Trasferimento} from '$lib/stato/trasferimenti';
	import { createEventDispatcher } from 'svelte';
	import Debug from './debug.svelte';

    export let trasferimento: Trasferimento;

    let inflow: number | undefined = undefined;
    let outflow: number | undefined = undefined;
    if (trasferimento.amount > 0) {
        inflow = trasferimento.amount == 0 ? undefined : trasferimento.amount;
    } else {
        outflow = trasferimento.amount == 0 ? undefined : trasferimento.amount * -1;
    }

    function preventInOutFlow(inorout: 'in' | 'out') {
        const bothFilled = outflow && inflow;
        if (inorout == 'in' && bothFilled) {
            outflow = undefined;
        } else if (inorout == 'out' && bothFilled) {
            inflow = undefined;
        }
    }

    const dispatch = createEventDispatcher<{
        salva:{trasferimento: Trasferimento},
        elimina:{trasferimento: Trasferimento}
    }>();
    function salva() {
        trasferimento.amount = inflow ? inflow : -(outflow || 0);
        dispatch("salva", {
            trasferimento
        });
    }

    function elimina() {
        if (confirm("Do you really want to delete?")) {
            dispatch("elimina", {
                trasferimento
            });
        }
    }
</script>

<Debug>#{trasferimento.id}:</Debug>
<div class="cont">
<form on:submit|preventDefault={salva}>
    <input name="date" type="date" bind:value={trasferimento.data} placeholder="Date" />
    <input name="payee" bind:value={trasferimento.payee} placeholder="Payee" />
    <BustaSelect bind:value={trasferimento.busta}></BustaSelect>
    <input name="memo" bind:value={trasferimento.memo} placeholder="Memo" />
    <AmmontaInput name="outflow" bind:value={outflow} placeholder="Outflow" on:blur={() => preventInOutFlow('out')}/>
    <AmmontaInput name="inflow" bind:value={inflow} placeholder="Inflow" on:blur={() => preventInOutFlow('in')} />

    <div>
        <label for="cleared" class="cleared-label">Cleared: </label><input id="cleared" type="checkbox" bind:checked={trasferimento.cleared} />

        <button type="submit">Save</button>
        {#if trasferimento.id}
        <button type="button" on:click={elimina}>Delete</button>
        {/if}
    </div>
</form>
</div>

<style>
    form {
        display: grid; 
        grid-template-columns: repeat(7, 1fr); 
        grid-template-rows: 1fr/* 1fr*/; 
        gap: 0px 3px;
    }

    .cleared-label {
        display: none;
    }
    
    @media only screen and (max-width: 640px) {
        .cont {
            margin-bottom: 4rem;
        }
        form {
            display: initial; 
        }

        form > input, form > :global(input), form > :global(select), form > button {
            display: block;
            width: 100%;
            padding: 0.4rem;
        }
        form > input[type="checkbox"] {
            display: initial;
            width: auto;
        }

        .cleared-label {
            display: initial;
        }
    }
</style>