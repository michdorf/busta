<script lang="ts">
	import { BASEPATH } from "$lib/base-path";
	import { eliminaWritable, salvaWritable } from "$lib/salvabile";
    import conti, { type Conto } from "$lib/stato/conti";
	import trasferimenti from "$lib/stato/trasferimenti";

    function rinomina(conto: Conto) {
        let nome = prompt("Nome del conto", conto.nome);
        if (nome) {
            conto.nome = nome;
            salvaWritable(conto, conti);
        }
    }

    function elimina(conto: Conto) {        
        if (confirm("Sei sicuro?")) {
            trasferimenti.update((v) => {
                return v.filter((_el) => {
                    return _el.contoId !== conto.id;
                });
            });

            eliminaWritable(conto, conti);
        }
    }
</script>

<h2>Lista di conti</h2>
{#each $conti as conto}
    <a href={`${BASEPATH}/trasferimenti/${conto.id}`}><b>{conto.nome}</b></a>
    <button on:click={() => {rinomina(conto)}}>Rinomina</button>
    <button on:click={() => {elimina(conto)}}>Elimina</button>
    <br/>
{/each}