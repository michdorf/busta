<script lang="ts">
	import { roundAmount } from "$lib/numeri";
	import stdValuta from "$lib/stato/valuta";

    export let amonta: number;
</script>

<span>{roundAmount(amonta)} {$stdValuta}</span>