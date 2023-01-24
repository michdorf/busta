<script lang="ts">
    import conti from "$lib/stato/conti";

    console.log($conti);
</script>

<h2>Lista di conti</h2>
{#each $conti as conto}
    <a href={`/trasferimenti/${conto.id}`}><b>{conto.nome}</b></a>
{/each}