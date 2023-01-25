<script lang="ts">
    import Busta from "$lib/c/busta.svelte";
	import { salvaWritable } from "$lib/salvabile";
    import Buste, {type Busta as BustaT} from "$lib/stato/buste";
    import Categorie, { type Categoria } from "$lib/stato/categorie";
	import Trasferimenti from "$lib/stato/trasferimenti";

    let conCategoria: Array<BustaT[]> = [];
    let senzaCategoria: BustaT[] = [];
    $: {
        $Categorie.forEach((categoria) => {
            conCategoria.push($Buste.filter((busta) => busta.categoria == categoria.id));
        });

        senzaCategoria = $Buste.filter(busta => !busta.categoria);
    }

    function cambiaCategoriaNome(categoria: Categoria) {
        let nome = prompt("Nuovo nome", categoria.nome);
        if (nome) {
            categoria.nome = nome;
            salvaWritable(categoria, Categorie);
        }
    }

    $: balance = $Trasferimenti.reduce((prev, cur) => prev + cur.amount, 0);
    $: assegnato = $Buste.reduce((prev, cur) => prev + cur.assegnato, 0); 

    $: daAssegnare = balance - assegnato;
</script>

<div>
    <span style="font-size: 2rem;">Da assegnare {daAssegnare}</span><br/>
    {balance} - {assegnato}
</div>

{#each $Categorie as categoria, i}
<details open>
    <summary>
        {categoria.nome}
        <button on:click={() => { cambiaCategoriaNome(categoria)}}>Rinomina</button>
    </summary>
    {#each conCategoria[i] as busta}
        <Busta {busta} />
    {/each}
</details>
{/each}

{#if senzaCategoria.length}
<details open>
    <summary>
      Senza categoria
      <!---<span class="icon">👇</span>-->
    </summary>
    {#each senzaCategoria as busta}
    <Busta {busta} />
    {/each}
</details>
{/if}

<style>
details[open] summary span.icon {
  transform: rotate(180deg);
}

summary::-webkit-details-marker {
  /* display: none; */ /* Hide arrow icon */
}
</style>