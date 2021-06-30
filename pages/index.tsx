import { useState, useEffect } from 'react';
import createAuth0Client, { Auth0Client, User } from '@auth0/auth0-spa-js';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { notify } from '../helpers/notify';

const Page = () => {
  const AUTH0_PARAM = { audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE };

  const [auth0Client, setAuth0Client] = useState<Auth0Client | null>(null);
  const [profile, setProfile] = useState<User>();
  const [idToken, setIdToken] = useState<string>();

  if (!auth0Client) {
    createAuth0Client({
      domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN || '',
      client_id: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || '',
      redirect_uri: process.env.NEXT_PUBLIC_AUTH0_REDIRECT_URI,
      audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
      useRefreshTokens: true,
      cacheLocation: 'localstorage',
    }).then(setAuth0Client);

    return null;
  }

  const login = async () => {
    if (!auth0Client) return;

    await auth0Client.loginWithPopup(AUTH0_PARAM);

    try {
      const idTokenClaims = await auth0Client.getIdTokenClaims(AUTH0_PARAM);
      setIdToken(idTokenClaims.__raw);

      const user = await auth0Client.getUser(AUTH0_PARAM);
      setProfile(user);
    } catch (e) {
      console.error(e);
    }
  };

  const logout = () => {
    auth0Client.logout({
      returnTo: process.env.NEXT_PUBLIC_AUTH0_LOGOUT_URI,
    });
  };

  useEffect(() => {
    (async () => {
      if (!auth0Client) return;

      try {
        const idTokenClaims = await auth0Client.getIdTokenClaims(AUTH0_PARAM);
        setIdToken(idTokenClaims.__raw);

        const user = await auth0Client.getUser(AUTH0_PARAM);
        setProfile(user);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [auth0Client]);

  return (
    <>
      {!profile && (
        <>
          Not logged in <br />
          <button onClick={login}>LOG IN</button>
        </>
      )}
      {profile && (
        <>
          Decoded JWT
          <pre>{JSON.stringify(profile, null, 4)}</pre>
          <div>
            <CopyToClipboard text={`Bearer ${idToken}`} onCopy={notify}>
              <button>Copy JWT as bearer token</button>
            </CopyToClipboard>
          </div>
          <ToastContainer />
          <button onClick={logout}>LOG OUT</button>
        </>
      )}
    </>
  );
};

export default Page;
