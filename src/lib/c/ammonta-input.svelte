<script lang="ts">
import stdValuta from "$lib/stato/valuta";
import { createEventDispatcher } from "svelte";
export let id: string | undefined = undefined;
export let value: number | undefined = undefined;
export let name = "";
export let placeholder = "Estimat"

let dispatch = createEventDispatcher<{change: number}>();

function onChange() {
    let num = comma2dot();
    dispatch('change', num);
}

// ToDo: split in aritmic junks (+ - / * ()) - parse as number and correct comma-sign - join by aritmic characters
function comma2dot() {
    let str = `${value}`;
    let m = str.match(new RegExp(`[0-9\.,]+`,"g")) // Find alle tal (adskilte af komma eller punktum)
    if (m !== null) {
        for (let i = 0; i < m.length; i++) {
            // Replace, så kun det sidste komma/punktum beholdes (2nd argument)
            str = str.replace(m[i], m[i].replace(/[\.,]([0-9]+)$/,";$1")
                                        .replace(/[^0-9;]/g,"")
                                        .replace(";",".")
                                        .replace(/^0+([^.].+)/g,"$1") /* remove trailing zeros (not in decimal numbers). eval thinks it is not decimal */);
        }
    }
    str = str.replace(/[^0-9\.\+\-\/\*\(\)]/g,""); // Remove anything other than equation
    let num = eval(str)
    if (isNaN(num)) {
        num = 0;
    }

    value = Math.round(num * 100) / 100;
    return value;
}
</script>

<span>
<input bind:value={value} on:change={onChange} step="0.01" on:click|stopPropagation {placeholder} {name} {id} on:blur /> {["kr.", "€"][["dkk","eur"].indexOf($stdValuta)]}
</span>

<style>
    input {
        text-align: right;
        width: 3em;
    }
</style>