<script lang="ts">
	import { monthsDiff } from "$lib/date";
    import appState from "$lib/stato/app-state";
	import Debug from "./debug.svelte";

    function scorsa() {
        prossima(-1);
    }
    function prossima(direzione: -1 | 1 = 1) {
        let tmp = mese;
        tmp += direzione;
        const now = new Date();
        const meseAtt = now.getMonth();
        let anno = $appState.meseSelez.getFullYear();

        if (false && monthsDiff(now, new Date($appState.meseSelez.getFullYear(), tmp, 1)) > 1) {
            tmp -= direzione; // block move
        }

        if (tmp > 11) {
            tmp = 0;
            anno += 1;
        } else if (tmp < 0) {
            tmp = 11;
            anno -= 1;
        }

        appState.update(($appState) => {
            $appState.meseSelez = new Date(anno, tmp, 15);
            return $appState;
        })
    }

    $: mese = new Date($appState.meseSelez).getMonth();
    $: anno = new Date($appState.meseSelez).getFullYear();
    $: nomeMese = ["Jan","Feb","Mar","Apr","Mag","Giu","Lug","Aug","Set","Ott","Nov","Dic"][mese];
    let oggi = new Date();
</script>

<Debug>{$appState.meseSelez}<br></Debug>
<div style="text-align: center; font-size: 1.5rem">
<button on:click={scorsa}>&lt;</button>
{nomeMese}
<button on:click={() => {prossima()}}>&gt;</button>
{#if anno !== oggi.getFullYear()}<div style="font-size: 0.6em">{anno}</div>{/if}
</div>
