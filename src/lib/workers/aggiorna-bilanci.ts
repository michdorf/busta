import { calcActivity } from "$lib/calc/buste";
import { monthsDiff, toISOstr } from "$lib/date";
import appState from "$lib/stato/app-state";
import Buste, { type BustaT } from "$lib/stato/buste";
import { get } from "svelte/store";

const aggiornato = get(appState).aggiornato;
if (monthsDiff(new Date(aggiornato), new Date())) {
    console.info("Aggiorna bilanci");
    
    // Aggiorna precAmonta per ogni busta
    Buste.update(($buste) => {
        $buste = $buste.map(($busta) => {
            $busta.precAmonta = calcActivity($busta) + $busta.assegnato;
            $busta.assegnato = 0;
            return $busta;
        });

        return $buste;
    });

    appState.update(($appState) => {
        $appState.aggiornato = toISOstr(new Date());
        return $appState;
    })
}