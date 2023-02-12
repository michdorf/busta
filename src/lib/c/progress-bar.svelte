<script lang="ts">
	import Debug from "./debug.svelte";


export let profitto: number;
export let speso: number = 0;
export let max = 100;
export let subtarget = false;

$: numeratore = /*Math.min(*/profitto/*, max)*/;
$: divisore = max === 0 ? 1 : max;
$: percentuale = Math.round((Math.abs(numeratore)/* + speso */)/divisore * 100);
$: percSpeso = profitto < 0 ? 0 : Math.min(Math.round(Math.abs(speso)/divisore * 100), 100);
$: percPrimo = profitto >= 0 ? percentuale : 100 - percentuale - percSpeso;
$: percSeconda = profitto < 0 ? percentuale : 100 - percentuale - percSpeso;
</script>

<Debug>numer. {numeratore} / divis. {divisore}; speso {speso}</Debug>
<div class="cont" class:subtarget={subtarget} class:overspent={profitto < 0}>
   {#if percPrimo > 0}<div class="disponibile" style={`width: ${percPrimo}%`}></div>{/if}{#if percSpeso > 0}<div class="speso" style={`width: ${percSpeso}%`}></div>{/if}{#if percSeconda > 0}<div class="overspent" style={`width: ${percSeconda}%`}></div>{/if}
</div>

<style>
 .cont {
   --border-radius: 0.3rem;
   height: 0.8rem;
 }

 .cont > * {
   border-style: solid;
   border-width: 1px 0 1px 0;
   box-sizing: border-box;
 }

 .cont > *:first-child {
   border-left-width: 1px;
   border-top-left-radius: var(--border-radius);
   border-bottom-left-radius: var(--border-radius);
 }
 .cont > *:last-child {
   border-right-width: 1px;
   border-top-right-radius: var(--border-radius);
   border-bottom-right-radius: var(--border-radius);
 }

 .cont > div {
   height: 100%;
   display: inline-block;
 }

 .cont .disponibile {
   background: rgb(var(--green));
   border-color: #59af52;
 }
 .cont.subtarget .disponibile {
   background: rgb(var(--orange));
   border-color: #e98b0d;
 }

 .cont.overspent .disponibile, .cont .overspent {
   border-color: silver;
   background: rgb(var(--silver));
 }

 .cont .speso {
   border-color: #59af52;
   background: repeating-linear-gradient(
      135deg,
      #66cc5e,
      #66cc5e 8px,
      #59af52 8px,
      #59af52 16px
      );
 }
 .cont.subtarget .speso {
   border-color: #e98b0d;
   background: repeating-linear-gradient(
      135deg,
      #feae42,
      #feae42 8px,
      #e98b0d 8px,
      #e98b0d 16px
      );
 }

 .cont.overspent .overspent {
   background: rgb(var(--red));
   border-color: #ff4d4e;
 }

</style>