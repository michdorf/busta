/**
 * Questo stato non viene salvato su refresh
 */

import { autoLogin, useOauth, type LoginState } from "$lib/oauth-client";
import { writable } from "svelte/store";

const appState = writable<{
    authState: LoginState;
    meseSelez: Date;
}>({
    authState: "no token",
    meseSelez: new Date()
});

export function updateAuthState(state: LoginState) {
    appState.update((s) => { s.authState = state; return s });
}

async function initLogin() {
    if (!useOauth) {
        updateAuthState("authorized");
        return;
    }

    try {
        let authed = await autoLogin();
        if (authed == false) {
            return;
        }
    } catch (e) {
        return;
    }
}

initLogin();

export default appState;