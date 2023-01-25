<script lang="ts">
    import Buste from "$lib/stato/buste";
</script>

{#each $Buste as busta}
    <b>{busta.nome}</b> Assegnato: {busta.target - busta.assegnato} ({busta.assegnato} - {busta.target})<br>
{/each}