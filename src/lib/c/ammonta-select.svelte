<script lang="ts">
import { parse, type default as Ammonta, type Valuta } from "$lib/interfacce/ammonta";
import { toAmmonta } from "$lib/interfacce/ammonta";

export let value: Ammonta = "200:eur";

let {stima, valuta} = parse(value);

$: {
    value = toAmmonta(stima, valuta);
}
</script>

<input bind:value={stima} placeholder="Estimat" /> 

<select bind:value={valuta}>
    <option value="eur">€</option>
    <option value="dkk">kr</option>
</select>