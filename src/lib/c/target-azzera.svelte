<script lang="ts">
	import { toISOstr } from "$lib/date";
	import Ricorrente from "moduli/moduli/ricorrente";
	import { salvaWritable } from "$lib/salvabile";
	import type { BustaT } from "$lib/stato/buste";
	import Buste from "$lib/stato/buste";
	import Debug from "./debug.svelte";

    export let busta: BustaT;
    $: deadline = (busta.target.tipo === "saving") ? (busta.target.deadlineAbil ? busta.target.deadline : "") : busta.target.prossima;
    $: scaduto = (deadline) && (new Date(deadline).getTime() < Date.now());

    function change(event: Event) {
        let value = (event.target as HTMLSelectElement).value as 'azzera' | 'continua';
        if (confirm("Sei sicuro che vuoi " + value)) {
            if (value === 'azzera') {
                busta.assegnamenti = [];
            }
            if (busta.target.tipo === 'spending') {
                busta.target.prossima = toISOstr(Ricorrente.prossima(busta.target.ripeti));
            } else {
                alert("Non so se ha senso se hai specificato un deadline");
            }
            salvaWritable(busta, Buste);
        }
    }
</script>

<!-- Fa parte di un flex container -->
<div>
    {#if scaduto}
        <Debug><i>Elimina questo comp.</i></Debug>
        <select on:change={change}>
            <option value="">Sciegli cosa fare</option>
            <option value="azzera">nulstil (= []) assegnamenti</option>
            <option value="continua">viderefør assegnamenti</option>
        </select>
    {/if}
    <Debug>Deadline/prossima: {deadline};</Debug>
</div>