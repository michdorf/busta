<script lang="ts">
	import { page } from "$app/stores";

    $: bustaId = $page.params.bustaId;
</script>

<h1>{bustaId}</h1>