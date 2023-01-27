<script lang="ts">
	import { primoDelMese } from "$lib/date";
    import Ricorrente from "$lib/ricorrente";

    let value = "2022-11-02";
    let intervallo: 'm' | 'a' = 'm';
    let intervalloN = 1;
    let r: Ricorrente;
    $: prossima = Ricorrente.prossima(r, primoDelMese(new Date()));
    $: {
        r = new Ricorrente(intervallo,intervalloN,primoDelMese(new Date(value)));
    }
</script>

<h1>Test</h1>
Relativt til i dag:<br>
Primo giorno: {r.primoGiorno}<br>
<input bind:value={intervalloN} placeholder="intervalloN" />
<input bind:value={intervallo} placeholder="intervallo" /> ("m" o "a")
<input type="date" bind:value={value} />
<br>
{prossima}
