<script lang="ts">
export let value: number | undefined = undefined;
export let name = "";
export let placeholder = "Estimat"

function comma2dot() {
    let num = parseFloat(`${value}`.replace(/,/g, "."));
    if (isNaN(num)) {
        num = 0;
    }
    value = Math.round(num * 100) / 100;
}
</script>

<input bind:value={value} on:change={comma2dot} step="0.01" {placeholder} {name} on:blur /> 