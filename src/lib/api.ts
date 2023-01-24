import oauthclient from "./oauth-client";

if (typeof window != "undefined") {
    let accessToken = oauthclient.getAccessToken();
    if (!accessToken && window.location.search.indexOf("code=") === -1) {
        oauthclient.authorizationCode('');
    }
}

export function sync(payload: any) {
    let token = oauthclient.getAccessToken();
    if (!token) {
        return;
    }

    fetch("https://dechiffre.dk/busta/api/", {
        method: 'POST',
        mode: 'cors',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        }),
        body: JSON.stringify(payload)
    }).then((response) => {
        console.log(response.text());
    })
}