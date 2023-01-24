import { derived } from 'svelte/store'
import Buste from './buste';
import Conti from './conti'
import Trasferimenti from './trasferimenti'

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
        
        /* Subscribe dopo che hai caricato lo stato corretto */
        Stato.subscribe((valore) => {
            localStorage.setItem(storKey, JSON.stringify(valore));
        });
    }
    
    init();
    
}

export default Stato;