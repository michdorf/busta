import oauthclient, { useOauth } from "./oauth-client";

/* if (typeof window != "undefined") {
    let accessToken = oauthclient.getAccessToken();
    if (!accessToken && window.location.search.indexOf("code=") === -1) {
        oauthclient.authorizationCode('');
    }
} */

export function sync(payload?: any) {
    return new Promise(async (resolve: (response: string) => void, reject) => {
        let options: RequestInit = {
            method: 'POST',
            mode: 'cors'
        };
        
        if (useOauth) {
            let token = oauthclient.getAccessToken();
            console.log(`sync[api.ts] has token ${token}`);
            if (!token) {
                reject("no token")
                return;
            }

            options.headers = new Headers({
                'Authorization': 'Bearer ' + token
            });
        }

        if (payload) {
            options.body = typeof payload == "string" ? payload : JSON.stringify(payload);
        }

        let url = /* location.protocol + */ "https://dechiffre.dk/busta/api/";
        fetch(url, options).then(async (response) => {
            resolve(await response.text());
        }).catch(reject)
    });
}