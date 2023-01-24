import OAuthClient from 'oauth-client/src/oauthclient'

// TODO: update oauth-client to work when window and localStorage are undefined

let oauthclient = new OAuthClient({
    authorization_url: "https://dechiffre.dk/oauth-server/v1/authorize.php",
    token_url: "https://dechiffre.dk/oauth-server/v1/token.php",
    client_id: "sveltekit",
    redirect_uri: "http://localhost:5173/oauth-callback/"
});

export default oauthclient;