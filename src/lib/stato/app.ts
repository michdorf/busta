/**
 * Questo stato non viene salvato su refresh
 */

import { autoLogin, type LoginState } from "$lib/oauth-client";
import { writable } from "svelte/store";

const appState = writable<{
    authState: LoginState
}>({
    authState: "no token",
});

export function updateAuthState(state: LoginState) {
    appState.update((s) => { s.authState = state; return s });
}

async function initLogin() {
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