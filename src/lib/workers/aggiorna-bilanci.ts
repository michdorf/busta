import { monthsDiff, toISOstr } from "$lib/date";
import appState from "$lib/stato/app-state";
import Buste, { type BustaT } from "$lib/stato/buste";
import { get } from "svelte/store";

const aggiornato = get(appState).aggiornato;

if (monthsDiff(new Date(aggiornato), new Date())) {
    console.info("Aggiorna bilanci");
    debugger;
    
    // Aggiorna precAmonta per ogni busta - ikke relevant, da det kan kalkoleres til en hver tid
    /* Buste.update(($buste) => {
        $buste = $buste.map(($busta) => {
            let activity = calcActivity($busta);
            $busta.precAmonta = get(activity).delmese + $busta.assegnato;
            $busta.assegnato = 0;
            return $busta;
        });

        return $buste;
    });*/

    // Aggiorna assegnamenti precedenti (se non pronto)
    Buste.update(($buste) => {
        return  $buste.map(($busta) => {
            // let ultimAssegnamento = $busta.assegnamenti[$busta.assegnamenti.length - 1];
            if (typeof $busta.assegnamenti === "undefined") {
                $busta.assegnamenti = [];
            }
            $busta.assegnamenti.push([aggiornato, $busta.assegnato]);
            $busta.assegnato = 0;
            return $busta;
        });
    });

    // Salva 
    appState.update(($appState) => {
        $appState.aggiornato = toISOstr(new Date());
        return $appState;
    })
}