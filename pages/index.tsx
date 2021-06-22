import { useCallback, useState, useMemo } from 'react';
import createAuth0Client from '@auth0/auth0-spa-js';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { notify } from '../helpers/notify';

const Page = () => {
  const AUTH0_PARAM = { audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE };

  const [auth0, setAuth0] = useState<any>();
  const [profile, setProfile] = useState<Object>();
  const [auth0Token, setAuth0Token] = useState<string>();

  const login = useCallback(async () => {
    if (!auth0) return;

    await auth0.loginWithPopup(AUTH0_PARAM);

    const user: Object = await auth0.getUser(AUTH0_PARAM);
    setProfile(user);
  }, [auth0]);

  const logout = useCallback(() => {
    auth0.logout();
  }, [auth0]);

  useMemo(async () => {
    if (!auth0) return;

    try {
      const token = await auth0.getTokenSilently(AUTH0_PARAM);
      setAuth0Token(token);
      console.log(token);

      const user = await auth0.getUser(AUTH0_PARAM);
      setProfile(user);
    } catch (e) {
      console.log(e);
    }
  }, [auth0]);

  if (!auth0) {
    createAuth0Client({
      domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN || '',
      client_id: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || '',
      redirect_uri: process.env.NEXT_PUBLIC_AUTH0_REDIRECT_URI,
      audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
      useRefreshTokens: true,
    }).then(setAuth0);

    return null;
  }

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
            <CopyToClipboard text={`Bearer ${auth0Token}`} onCopy={notify}>
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
