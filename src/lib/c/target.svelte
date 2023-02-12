<script lang="ts">
	import type { BustaT } from "$lib/stato/buste";
    import ProgressBar from '$lib/c/progress-bar.svelte';
    import Debug from '$lib/c/debug.svelte';
	import type { ActivityT } from "$lib/calc/activity";
	import type { Readable } from "svelte/store";
	import Amonta from "./amonta.svelte";
	import TargetSummary from "./target-summary.svelte";
	import { toISOstr } from "$lib/date";
    import {calcActivityPeriodo} from "../calc/activity";
    import {calcAssegnamentiPeriodo} from "../calc/assegnamenti";

    export let busta: BustaT;
    export let periodo: {da: Date, a: Date} | undefined;
    export let overspent: boolean;
    export let suptarget: boolean;
    export let subtarget: boolean;
    export let available: number;
    export let activity: Readable<ActivityT>;
    export let assegnamenti: Readable<ActivityT>;
    export let targetXmese: Readable<number>;

    $: attivitaPeriodo = calcActivityPeriodo($trasf => $trasf.busta === busta.id, periodo ? periodo.da : null, periodo ? periodo.a : null);
    $: assegnamentiPeriodo = calcAssegnamentiPeriodo(periodo, busta);

    $: availablePeriodo = $assegnamentiPeriodo.finora + $attivitaPeriodo.finora;
    $: profitto = availablePeriodo;
    $: speso = busta.target.tipo === "spending" ? ($attivitaPeriodo.finora < 0 ? $attivitaPeriodo.finora : 0) : 0; 
    $: max = Math.max(busta.target.target, availablePeriodo);
</script>

<Debug>{#if periodo}Periodo: {toISOstr(periodo.da)} - {toISOstr(periodo.a)}{/if}</Debug>
<div>
    {profitto}
    <ProgressBar 
        profitto={profitto}
        speso={speso} 
        max={max} subtarget={subtarget} /> 
</div>
<Debug><div style="text-align: right; background-color: color(srgb 0.8762 0.9402 0.99)">(<Amonta amonta={$assegnamenti.delmese + $activity.delmese} />[balance] + <Amonta amonta={$activity.precedente} />[prec])</div></Debug>
<TargetSummary busta={busta} targetXmese={$targetXmese} assegnato={$assegnamenti.delmese} attivitaPrec={$activity.precedente} available={available} />
<Debug><div style="text-align: center;">Assegnamenti: {JSON.stringify(busta.assegnamenti)}</div></Debug>