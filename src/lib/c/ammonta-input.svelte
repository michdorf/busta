<script lang="ts">
import stdValuta from "$lib/stato/valuta";
export let id: string | undefined = undefined;
export let value: number | undefined = undefined;
export let name = "";
export let placeholder = "Estimat"

// ToDo: split in aritmic junks (+ - / * ()) - parse as number and correct comma-sign - join by aritmic characters
function comma2dot() {
    let str = `${value}`.replace(/,/g, ".").replace(/[^0-9\.\+\-\/\*\(\)]/g,"");
    str = str.replace(/(^0+|[\+\-\/*]0+)/,""); // Remove trailing zeros => eval thinks it is not decimal
    let num = eval(str)
    if (isNaN(num)) {
        num = 0;
    }
    value = Math.round(num * 100) / 100;
}
</script>

<span>
<input bind:value={value} on:change={comma2dot} step="0.01" on:click|stopPropagation {placeholder} {name} {id} on:blur on:change /> {["kr.", "€"][["dkk","eur"].indexOf($stdValuta)]}
</span>

<style>
    input {
        text-align: right;
        width: 3em;
    }
</style>