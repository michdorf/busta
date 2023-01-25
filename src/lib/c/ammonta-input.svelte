<script lang="ts">
export let value: number | undefined = undefined;
export let name = "";
export let placeholder = "Estimat"

function comma2dot() {
    value = Math.round(parseFloat(`${value}`.replace(/,/g, "."))*100) / 100;
}
</script>

<input bind:value={value} on:change={comma2dot} step="0.01" {placeholder} {name} on:blur /> 