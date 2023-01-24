import { derived } from 'svelte/store'
import Buste from './buste';
import Conti from './conti'
import Trasferimenti from './trasferimenti'
import {sync} from '$lib/api';

let Stato = derived([Conti, Trasferimenti, Buste], ([$conti, $trasferimenti, $buste]) => {
    return {
        conti: $conti,
        trasferimenti: $trasferimenti,
        buste: $buste
    }
});

if (typeof window != "undefined" && 'localStorage' in window) {
    let storKey = "busta-stato";
    
    function init() {
        let stato = JSON.parse(localStorage.getItem(storKey) || "{}");
        Trasferimenti.set(stato.trasferimenti || []);
        Conti.set(stato.conti || []);
        Buste.set(stato.buste || []);
        
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
    
    sync().then((responseTxt) => {
        localStorage.setItem(storKey, responseTxt);
        init();
    }).catch(() => {
        init();
    });
}

export default Stato;