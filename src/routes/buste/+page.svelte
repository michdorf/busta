<script lang="ts">
    import Buste from "$lib/stato/buste";
</script>

{#each $Buste as busta}
    <b>{busta.nome}</b><br>
{/each}