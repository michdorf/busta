<script lang="ts">
    import Amonta from "$lib/c/amonta.svelte";
    import BustaDetail from "$lib/c/busta-detail.svelte";
    import Busta from "$lib/c/busta.svelte";
	import CambiaMese from "$lib/c/cambia-mese.svelte";
	import Debug from "$lib/c/debug.svelte";
	import { calcActivity, calcReddito } from "$lib/calc/activity";
	import { calcAssegnamenti, calcRolloverAssegnabile } from "$lib/calc/assegnamenti";
	import { primoDelMese } from "$lib/date";
	import { salvaWritable } from "$lib/salvabile";
	import appState from "$lib/stato/app-state";
    import Buste, {type BustaT} from "$lib/stato/buste";
    import Categorie, { type Categoria } from "$lib/stato/categorie";
	import Trasferimenti from "$lib/stato/trasferimenti";

    function cambiaCategoriaNome(categoria: Categoria) {
        let nome = prompt("Nuovo nome", categoria.nome);
        if (nome) {
            categoria.nome = nome;
            salvaWritable(categoria, Categorie);
        }
    }

    function salvaBustaDetail(event: CustomEvent<{busta: BustaT}>) {
        const busta = event.detail.busta;
        if (typeof bustaSelez !== "undefined") {
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
    }

    function selezBusta(ev: MouseEvent, busta: BustaT) {
        if ((ev.target as HTMLElement).tagName === 'DIV') {
            bustaSelez = busta;
        }
    }

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
    
    $: conCategoria = $Categorie.map(($categoria) => {
        return $Buste.filter((busta) => busta.categoria == $categoria.id);
    });

    let bustaSelez: BustaT | undefined;
    $: activity = calcActivity();
    $: balance = $activity.finora;
    // $: assegnato = $Buste.reduce((prev, cur) => prev + cur.assegnato, 0);
    $: assegnamenti = calcAssegnamenti();
    $: assegnato = $assegnamenti.delmese;
    // TODO: daAssegnare skal være balancen fra forrige måned + alle INDKOMSTER 
    $: mesePrec = $activity.precedente;   
    $: totalRolloverAssegnamenti = calcRolloverAssegnabile();

    /**
     * Reddito che NON ha una categoria = pronto ad assegnare
     */
    $: prontoPerAssegnamento = $Trasferimenti.reduce((prev, cur) => {
        if (stessoMese(new Date(cur.data), $appState.meseSelez) 
            /* && (cur.amount > 0) */ /* Ogni "ready to assign" - spesa or reddito */
            && (!cur.busta)) {
            return prev + cur.amount; 
        } else {
            return prev;
        }
    },0);
    $: daAssegnare = $totalRolloverAssegnamenti + prontoPerAssegnamento - assegnato;
</script>

<CambiaMese />
<div style="margin-bottom: 1rem">
    <div class="daAssegnare" class:positivo={daAssegnare > 0} class:overspent={daAssegnare < 0} style="font-size: 2rem;">Ready to assign <span><Amonta amonta={daAssegnare} /></span> <Debug>({prontoPerAssegnamento} "Ready to assign")</Debug></div><br/>
    <Amonta amonta={balance} /> balance - <Amonta amonta={assegnato} /> assigned. 
    <Debug><Amonta amonta={mesePrec} /> il mese precedente (<Amonta amonta={$totalRolloverAssegnamenti} /> rollover).</Debug>
</div>

<div class="grid-cont" class:targetInEdita={typeof bustaSelez !== "undefined"}>
    <div class="categorie">
        {#each $Categorie as categoria, i}
        <details open>
            <summary>
                {categoria.nome}
                <button on:click={() => { cambiaCategoriaNome(categoria)}}>Rename</button>
            </summary>
            {#each conCategoria[i] as busta}
                <span on:click={() => {bustaSelez = busta}}>
                    <Busta {busta} />
                </span>
            {/each}
        </details>
        {/each}
    </div>
    
    <div class="busta-detail">
       <BustaDetail busta={bustaSelez} on:salva={salvaBustaDetail} on:close={() => {bustaSelez = undefined}} />
    </div>
</div>

<style>
details[open] summary span.icon {
  transform: rotate(180deg);
}

summary::-webkit-details-marker {
  /* display: none; */ /* Hide arrow icon */
}

.daAssegnare.positivo span {
    font-weight: bold;
    background: #06d0b5;
    padding: 0.3rem;
    border-radius: 0.3rem;
}

.daAssegnare.overspent {
    background-color: rgb(var(--red));
    border-radius: 0.3rem;
    border: 1px solid rgb(255, 50, 50);
    padding: 0.2rem;
}

details summary {
    font-size: 1.2rem;
    background-color: rgb(235, 235, 235);
    padding: 4px;
    position: sticky;
    top: 0;
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

    .grid-cont.targetInEdita .categorie {
        display: none;
    }
}
</style>