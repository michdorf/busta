<script lang="ts">
export let id: string | undefined = undefined;
export let value: number | undefined = undefined;
export let name = "";
export let placeholder = "Estimat"

function comma2dot() {
    let str = `${value}`.replace(/,/g, ".").replace(/[^0-9\.\+\-\/\*\(\)]/g,"");
    let num = eval(str)
    if (isNaN(num)) {
        num = 0;
    }
    value = Math.round(num * 100) / 100;
}
</script>

<input bind:value={value} on:change={comma2dot} step="0.01" on:click|stopPropagation {placeholder} {name} {id} on:blur on:change /> 