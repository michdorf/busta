<script lang="ts">
    import { toISOstr } from "$lib/date";
    import type Ricorrente from "../../moduli/moduli/ricorrente";
	import Debug from "./debug.svelte";

    
    export let value: Ricorrente;
    export let id: string;
    let primoGiornoISO: string = toISOstr(value.primoGiorno);

    $: value.primoGiorno = new Date(primoGiornoISO);
</script>

<label for="intervallo">Each </label>
<input bind:value={value.intervalloN} type="number" size="5" step="1" />
<select id="intervallo" bind:value={value.intervallo}>
    <option value="m">Month</option>
    <option value="a">Year</option>
</select><br />
<label for="data">Beginning the </label>
<input id="data" type="date" bind:value={primoGiornoISO} /><br>
<Debug>{JSON.stringify(value)}</Debug>
