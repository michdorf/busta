<script lang="ts">
    import Amonta from "$lib/c/amonta.svelte";
    import BustaDetail from "$lib/c/busta-detail.svelte";
    import Busta from "$lib/c/busta.svelte";
	import { primoDelMese } from "$lib/date";
	import { salvaWritable } from "$lib/salvabile";
	import appState from "$lib/stato/app-state";
    import Buste, {type BustaT} from "$lib/stato/buste";
    import Categorie, { type Categoria } from "$lib/stato/categorie";
	import Trasferimenti from "$lib/stato/trasferimenti";

    let conCategoria: Array<Array<BustaT>> = [];
    let senzaCategoria: Array<BustaT> = [];
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

    function salvaBustaDetail(event: CustomEvent<{busta: BustaT}>) {
        const busta = event.detail.busta;
        bustaSelez.targetAbilitato = busta.targetAbilitato;
        bustaSelez.target = busta.target;
        if ('ripeti' in bustaSelez.target && 'ripeti' in busta.target) {
            bustaSelez.target.ripeti = busta.target.ripeti;
        } else if ('deadline' in bustaSelez.target && 'deadline' in busta.target) {
            bustaSelez.target.deadlineAbil = busta.target.deadlineAbil;
            bustaSelez.target.deadline = busta.target.deadline;
        }

        salvaWritable(bustaSelez, Buste);
    }

    let bustaSelez: BustaT;
    $: balance = $Trasferimenti.reduce((prev, cur) => prev + cur.amount, 0);
    $: assegnato = $Buste.reduce((prev, cur) => prev + cur.assegnato, 0);

    function saldoPrec() {
        let mese = primoDelMese(new Date());
        return $Trasferimenti.reduce((prev, cur) => {
            if (new Date(cur.data).getTime() < mese.getTime()) {
                return prev + cur.amount;
            }
            return prev;
        }, 0);
    }

    function stessoMese(d1: Date, d2: Date) {
        return d1.getMonth() == d2.getMonth() && d1.getFullYear() == d2.getFullYear();
    }

    // TODO: daAssegnare skal være balancen fra forrige måned + alle INDKOMSTER 
    $: mesePrec = saldoPrec();     
    $: daAssegnare = mesePrec - assegnato + $Trasferimenti.reduce((prev, cur) => {
        if (stessoMese(new Date(cur.data), $appState.meseSelez) && (cur.amount > 0)) {
            return prev + cur.amount; 
        } else {
            return prev;
        }
    },0);
</script>

<div>
    <span style="font-size: 2rem;">Da assegnare <Amonta amonta={daAssegnare} /></span><br/>
    <Amonta amonta={balance} /> balance - <Amonta amonta={assegnato} /> assegnato. <Amonta amonta={mesePrec} /> il mese precedente.
</div>

<div class="grid-cont">
    <div>
        {#each $Categorie as categoria, i}
        <details open>
            <summary>
                {categoria.nome}
                <button on:click={() => { cambiaCategoriaNome(categoria)}}>Rinomina</button>
            </summary>
            {#each conCategoria[i] as busta}
                <span on:click={() => {bustaSelez = busta}}>
                    <Busta {busta} />
                </span>
            {/each}
        </details>
        {/each}

        <!-- {#if senzaCategoria.length}
        <details open>
            <summary>
            Senza categoria
            </summary>
            {#each senzaCategoria as busta} 
            <Busta {busta} />
            {/each}
        </details>
        {/if} -->
    </div>
    
    <div>
       <BustaDetail busta={bustaSelez} on:salva={salvaBustaDetail}/>
    </div>
</div>

<style>
details[open] summary span.icon {
  transform: rotate(180deg);
}

summary::-webkit-details-marker {
  /* display: none; */ /* Hide arrow icon */
}

.grid-cont {
    display: grid; 
    grid-template-columns: repeat(2, 1fr); 
    grid-template-rows: 1fr; 
    grid-column-gap: 5px;
    grid-row-gap: 5px; 
}

@media only screen and (max-width: 640px) {
    .grid-cont {
        gap: 0;
        grid-template-columns: 1fr; /* 1x kolonner fyldende 1 fraction hver */
    }

    .grid-cont > div {
        margin-top: 2rem;
    }
}
</style>