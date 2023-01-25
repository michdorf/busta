import { derived, get } from 'svelte/store'
import Buste from './buste';
import Conti from './conti'
import Trasferimenti from './trasferimenti'
import {sync} from '$lib/api';
import appState from './app';
import Categorie from './categorie';

let Stato = derived([Conti, Trasferimenti, Buste, Categorie], ([$conti, $trasferimenti, $buste, $categorie]) => {
    return {
        conti: $conti,
        trasferimenti: $trasferimenti,
        buste: $buste,
        categorie: $categorie
    }
});

if (typeof window != "undefined" && 'localStorage' in window) {
    let storKey = "busta-stato";
    
    function init() {
        let stato = JSON.parse(localStorage.getItem(storKey) || "{}");
        Trasferimenti.set(stato.trasferimenti || []);
        Conti.set(stato.conti || []);
        Buste.set(stato.buste || []);
        Categorie.set(stato.categorie || []);
        
        let primoSinc = true;
        /* Subscribe dopo che hai caricato lo stato corretto */
        Stato.subscribe((valore) => {
            localStorage.setItem(storKey, JSON.stringify(valore));
            if (!primoSinc) {
                sync(valore);
            }
            primoSinc = false;
        });
    }
    
    let primoAuth = true;
    appState.subscribe((v) => {
        if (primoAuth && v.authState == 'authorized') {
            sync().then((responseTxt) => {
                if (responseTxt[0] == "{") {
                    localStorage.setItem(storKey, responseTxt);
                } else {
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