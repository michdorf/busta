<script lang="ts">
	import { page } from "$app/stores";
	import Amonta from "$lib/c/amonta.svelte";
	import Buste from "$lib/stato/buste";
	import Trasferimenti from "$lib/stato/trasferimenti";

    $: bustaId = $page.params.bustaId;
    $: busta = $Buste.filter((busta) => busta.id === bustaId)[0];
    $: trasferimenti = $Trasferimenti.filter(($trasf) => $trasf.busta == bustaId);
</script>

<h1>{busta.nome}</h1>

{#each trasferimenti as trasf}
<div class="linea">
    <div>
        <div style="display: flex;">
            <div>{trasf.data}</div>
            <div style="flex: 1; font-weight: bold;">{trasf.payee}</div>
            <div style="text-align: right;"><Amonta amonta={trasf.amount} /></div>
        </div>
        <i>{trasf.memo}</i>
    </div>
</div>
{/each}

<style>
    .linea > * {
        padding: 0.3rem;
    }

    .linea > * > div > div {
        padding: 0 4px;
    }

    .linea:nth-child(odd) {
        background-color: rgb(var(--silver));
    }
</style>