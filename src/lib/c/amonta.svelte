<script lang="ts">
	import { roundAmount } from "$lib/numeri";
	import stdValuta from "$lib/stato/valuta";

    export let amonta: number;
	$: valutaStr = ["kr.", "€"][["dkk","eur"].indexOf($stdValuta)];
</script>

<span>{roundAmount(amonta)} {valutaStr}</span>