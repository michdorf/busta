import { PUBLIC_CLIENT_ID, PUBLIC_CLIENT_SECRET, PUBLIC_REDIRECT_URI } from '$env/static/public';
import OAuthClient from 'oauth-client/src/oauthclient'
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
        let authState = getAuthState();
        if (authState == 'authorized') {
            updateAuthState('authorized');
            resolve(oauthclient.getAccessToken());
            return;
        }
        if (authState == 'access-token expired') {
            oauthclient.refreshToken().then((accesstoken) => {
                updateAuthState('authorized');
                resolve(accesstoken.access_token);
            }).catch(() => {
                updateAuthState("no token");
                reject();
            });
            return;
        }
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
        if (refreshExpire.getTime() < Date.now()) {
            return 'refresh-token expired';
        } else {
            return 'access-token expired';
        }
    }

    return 'authorized';
}

export default oauthclient;