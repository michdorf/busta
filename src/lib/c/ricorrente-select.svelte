<script lang="ts">
    import { toISOstr } from "$lib/date";
    import Ricorrente from "moduli/moduli/ricorrente";

    
    export let value = new Ricorrente('m', 1, new Date());
    let intervallo: 'm' | 'a' | 'g' | 's' = value.intervallo || 'm';
    let intervalloN = value.intervalloN || 1;
    let primoGiornoISO = toISOstr(value.primoGiorno);

    $: {
        value.intervallo = intervallo;
        value.intervalloN = intervalloN;
        value.primoGiorno = new Date(primoGiornoISO);
    }
</script>

<label for="intervallo">Ogni </label>
<input bind:value={intervalloN} type="number" size="5" step="1" />
<select id="intervallo" bind:value={intervallo}>
    <option value="m">Mese</option>
    <option value="a">Anno</option>
</select><br />
<label for="data">Iniziando il </label>
<input id="data" type="date" bind:value={primoGiornoISO} />