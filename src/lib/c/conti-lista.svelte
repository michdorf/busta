<script lang="ts">
	import { BASEPATH } from "$lib/base-path";
	import { eliminaWritable, salvaWritable } from "$lib/salvabile";
    import conti, { type Conto } from "$lib/stato/conti";
	import trasferimenti from "$lib/stato/trasferimenti";

    function rinomina(conto: Conto) {
        let nome = prompt("Account name", conto.nome);
        if (nome) {
            conto.nome = nome;
            salvaWritable(conto, conti);
        }
    }

    function elimina(conto: Conto) {        
        if (confirm("Are you sure?")) {
            trasferimenti.update((v) => {
                return v.filter((_el) => {
                    return _el.contoId !== conto.id;
                });
            });

            eliminaWritable(conto, conti);
        }
    }
</script>

<h2>List of accounts</h2>
{#each $conti as conto}
    <a href={`${BASEPATH}/trasferimenti/${conto.id}`}><b>{conto.nome}</b></a>
    <button on:click={() => {rinomina(conto)}}>Rename</button>
    <button on:click={() => {elimina(conto)}}>Delete</button>
    <br/>
{/each}