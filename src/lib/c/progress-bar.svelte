<script lang="ts">
export let bilancio: number;
export let max = 100;
export let subtarget = false;

$: verdeOarancione = subtarget ? 'rgb(var(--orange))' : 'rgb(var(--green))';
$: primoColore = bilancio > 0 ? verdeOarancione : 'rgb(var(--silver))';
$: secondoColore = bilancio < 0 ? 'rgb(var(--red))' : 'rgb(var(--silver))';
$: percentuale = Math.round(Math.abs(bilancio)/max * 100);
$: background = `linear-gradient(to right, ${primoColore} ${percentuale}%, ${secondoColore} ${percentuale}%)`;
</script>

<div class="progress" style={`background:${background}`}>{bilancio} / {max}</div>

<style>
 div.progress,
 progress,
 progress::-moz-progress-bar,
 progress::-webkit-progress-value
 {
    border: 1px solid silver;
    border-radius: 0.4rem;
    height: 0.5rem;
    width: 100%;
    background:linear-gradient(to right, red 20%, blue 20%, blue 50%,yellow 50%,yellow 60% ,green 0);
 }
</style>