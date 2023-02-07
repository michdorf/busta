<script lang="ts">
	import { primoDelMese } from "$lib/date";
    import Ricorrente from "$lib/ricorrente";

    let value = "2022-11-02";
    let offset = "2023-01-01";
    let intervallo: 'm' | 'a' = 'm';
    let intervalloN = 1;
    let r: Ricorrente;
    $: prossima = Ricorrente.prossima(r, new Date(offset));
    $: {
        r = new Ricorrente(intervallo,intervalloN,new Date(value));
    }
</script>

<h1>Test</h1>
Relativt til : <input type="date" bind:value={offset} /><br>
Primo giorno: {r.primoGiorno}<br>
<input bind:value={intervalloN} placeholder="intervalloN" />
<input bind:value={intervallo} placeholder="intervallo" /> ("m" o "a")
<input type="date" bind:value={value} />
<br>
{prossima}
