<script lang="ts">
    import { toISOstr } from "$lib/date";
    import type Ricorrente from "moduli/moduli/ricorrente";

    
    export let value: Ricorrente;
    export let id: string;
    let primoGiornoISO: string = toISOstr(value.primoGiorno);

    $: value.primoGiorno = new Date(primoGiornoISO);
</script>

<label for="intervallo">Ogni </label>
<input bind:value={value.intervalloN} type="number" size="5" step="1" />
<select id="intervallo" bind:value={value.intervallo}>
    <option value="m">Mese</option>
    <option value="a">Anno</option>
</select><br />
<label for="data">Iniziando il </label>
<input id="data" type="date" bind:value={primoGiornoISO} /><br>
{JSON.stringify(value)}
