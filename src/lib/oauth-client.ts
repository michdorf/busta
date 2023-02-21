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
                console.log("autoLogin resource resp: " + typeof resp !== "string" ? JSON.stringify(resp) : resp);
                if ('error' in resp) {
                    alert("Resource error: " + (typeof resp !== "string" ? JSON.stringify(resp) : resp));
                    oauthclient.refreshToken().then((accesstoken) => {
                        console.info(`refreshed`);
                        resolve(accesstoken.access_token);
                        updateAuthState('authorized');
                    }).catch(() => {
                        alert("Error refreshing");
                        console.error(`error with refresh in autoLogin()`);
                        updateAuthState("no token");
                        reject();
                    });
                } else {
                    alert("Authorized in resource");
                    updateAuthState('authorized');
                    resolve(token);
                }
            }).catch((e) => {
                alert("Error when fetching resource");
                updateAuthState('no token');
                console.error("Error in autologin()");
            });
        } else {
            alert("No token saved");
            updateAuthState("no token");
            reject("no token");
        }

        return;

        let authState = getAuthState();
        if (authState == 'authorized') {
            updateAuthState('authorized');
            resolve(oauthclient.getAccessToken());
            console.error(`nemt`);
            return;
        }
        if (authState == 'access-token expired') {
            console.error(`exipred`);
            oauthclient.refreshToken().then((accesstoken) => {
                console.error(`refreshed`);
                updateAuthState('authorized');
                resolve(accesstoken.access_token);
            }).catch(() => {
                console.error(`error with refresh`);
                updateAuthState("no token");
                reject();
            });
            return;
        }
        console.error(`reject no token`);
        updateAuthState("no token");
        reject(false);
    });
}

export type LoginState = 'authorized' | 'access-token expired' | 'refresh-token expired' | 'no token';
function getAuthState(): LoginState {
    const token = oauthclient.getAccessToken();
    if (!token) {
        console.error("No token");
        return 'no token';
    }

    const tokenObj = oauthclient.getAccessTokenObject();

    let expire = Date.parse(tokenObj?.expires + "");
    if (expire < Date.now()) {
        let refreshTokenExpireTime = 14; // days
        let refreshExpire: number | Date = new Date();
        refreshExpire = new Date(refreshExpire);
        refreshExpire.setDate(refreshExpire.getDate() + refreshTokenExpireTime);
        console.error(`refreshExpire ${refreshExpire} expire ${expire}`);
        if (refreshExpire.getTime() < Date.now()) {
            return 'refresh-token expired';
        } else {
            return 'access-token expired';
        }
    }

    console.error(`auth nemt`);
    console.log(tokenObj);
    return 'authorized';
}

export default oauthclient;