import { derived, get } from 'svelte/store'
import Buste, { type BustaT } from './buste';
import Conti from './conti'
import Trasferimenti from './trasferimenti'
import {sync} from '$lib/api';
import appState, { setLoginError } from './app-state';
import Categorie from './categorie';
import { toISOstr } from '$lib/date';
import { nuovaModifica, setNuovaModifica } from '$lib/salvabile';
import Ricorrente, { type RicorrenteJSONT } from 'moduli/moduli/ricorrente';

let Stato = derived([Conti, Trasferimenti, Buste, Categorie, appState], ([$conti, $trasferimenti, $buste, $categorie, $appState]) => {
    return {
        aggiornato: $appState.aggiornato,
        conti: $conti,
        trasferimenti: $trasferimenti,
        buste: $buste,
        categorie: $categorie
    }
});

if (typeof window != "undefined" && 'localStorage' in window) {
    let storKey = "busta-stato";
    
    function init() {
        let statostr = localStorage.getItem(storKey) || "{}";
        const localtime = statostr.substring(0, statostr.indexOf("{"));
        const jsonstr = statostr.substring(statostr.indexOf("{"));
        let stato = JSON.parse(jsonstr);
        Trasferimenti.set(stato.trasferimenti || []);
        Conti.set(stato.conti || []);
        let buste: BustaT[] = (stato.buste || []).map((busta: BustaT) => {
            if (busta.target.tipo === "spending") {
                busta.target.ripeti = Ricorrente.daJSON(busta.target.ripeti as unknown as RicorrenteJSONT);
            }
            return busta;
        });
        Buste.set(buste);
        Categorie.set(stato.categorie || []);
        appState.update(($appState) => {
            $appState.aggiornato = stato.aggiornato || toISOstr(new Date());
            return $appState;
        });
        
        let primoSinc = true;
        /* Subscribe dopo che hai caricato lo stato corretto */
        Stato.subscribe((valore) => {
            let statostr = localStorage.getItem(storKey) || "{}";
            let localtime = statostr.substring(0, statostr.indexOf("{"));
            let valorestr = (nuovaModifica ? Date.now() : localtime) + JSON.stringify(valore);
            localStorage.setItem(storKey, valorestr);
            if (!primoSinc && nuovaModifica) { // Sembra che viene eseguita 2x su ogni cambiamento
                console.log("Salva perche ce nuova modifica.");
                setNuovaModifica(false);

                sync(valorestr).then(responseTxt => {
                    if (responseTxt.substring(0,6) === "ERRORE") {
                        setLoginError("API responds with an error: " + responseTxt);
                    }
                });
            }
            primoSinc = false;
        });
    }
    
    let primoAuth = true;
    appState.subscribe((v) => {
        if (primoAuth && v.authState == 'authorized') {
            sync().then((responseTxt) => {
                if (responseTxt.substring(0,6) != "ERRORE") {
                    const localState = localStorage.getItem(storKey) || "";
                    const servertime = responseTxt.substring(0, responseTxt.indexOf("{"));
                    const localtime = localState.substring(0, localState.indexOf("{"));
                    
                    if (servertime > localtime) {   
                        console.log("Loaded from server because it was "+servertime+"[server] vs. "+localtime+"[local]");          
                        localStorage.setItem(storKey, responseTxt);
                    }
                } else {
                    setLoginError("API responded with an error: " + responseTxt);
                    console.log("Sembra un errore da dechiffre.dk", responseTxt);
                }
                init();
            });

            primoAuth = false;
        }
    });
    
    if (get(appState).authState != "authorized") { // If user has been authorized beforehand
        init();
    }
}

export function reset() {
    Conti.set([]);
    Trasferimenti.set([]);
    Buste.set([]);
    Categorie.set([]);
}

export default Stato;