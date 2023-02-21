import { PUBLIC_CLIENT_ID, PUBLIC_CLIENT_SECRET, PUBLIC_REDIRECT_URI } from '$env/static/public';
import OAuthClient from '../../oauth-client/src/oauthclient'
import appState, { updateAuthState } from './stato/app-state';

export const useOauth = true; // process.env.NODE_ENV === 'development';

// TODO: update oauth-client to work when window and localStorage are undefined

let oauthclient = new OAuthClient({
    authorization_url: "https://dechiffre.dk/oauth-server/v1/authorize.php",
    token_url: "https://dechiffre.dk/oauth-server/v1/token.php",
    client_id: PUBLIC_CLIENT_ID,
    client_secret: PUBLIC_CLIENT_SECRET,
    redirect_uri: PUBLIC_REDIRECT_URI
});

export type LoginState = 'authorized' | 'access-token expired' | 'refresh-token expired' | 'no token';
export function autoLogin() {
    return new Promise<string | false>((resolve, reject) => {
        const token = oauthclient.getAccessToken();
        if (token) {
            fetch(`https://dechiffre.dk/oauth-server/v1/resource.php`, {
                method: 'POST',
                mode: 'cors',
                headers: new Headers({
                    'Authorization': 'Bearer ' + token
                })
            }).then(async (response) => {
                let resp = await response.json();
                if ('error' in resp) {
                    console.error("Resource error: " + (typeof resp !== "string" ? JSON.stringify(resp) : resp));
                    oauthclient.refreshToken().then((accesstoken) => {
                        console.info(`refreshed`);
                        resolve(accesstoken.access_token);
                        updateAuthState('authorized');
                    }).catch(() => {
                        console.error(`error with refresh in autoLogin()`);
                        updateAuthState("no token");
                        reject();
                    });
                } else {
                    updateAuthState('authorized');
                    resolve(token);
                }
            }).catch((e) => {
                updateAuthState('no token');
                console.error("Error in autologin()");
            });
        } else {
            updateAuthState("no token");
            reject("no token");
        }
    });
}

export default oauthclient;