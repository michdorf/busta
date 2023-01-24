import oauthclient from "./oauth-client";

if (typeof window != "undefined") {
    let accessToken = oauthclient.getAccessToken();
    if (!accessToken && window.location.search.indexOf("code=") === -1) {
        oauthclient.authorizationCode('');
    }
}

export function sync(payload?: any) {
    return new Promise((resolve: (response: string) => void, reject) => {
        let token = oauthclient.getAccessToken();
        if (!token) {
            reject("no token");
        }

        let options: RequestInit = {
            method: 'POST',
            mode: 'cors',
            headers: new Headers({
                'Authorization': 'Bearer ' + token
            })
        };

        if (payload) {
            options.body = JSON.stringify(payload);
        }

        fetch("https://dechiffre.dk/busta/api/", options).then(async (response) => {
            resolve(await response.text());
        }).catch(reject)
    });
}