import Head from 'next/head';
import { useCallback, useState, useMemo } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import jwtDecode from 'jwt-decode';

import { notify } from '../helpers/notify';

const Page = () => {
  // auth0を呼ぶときのパラメータ
  const AUTH0_PARAM = {
    audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
    scope: 'read:current_user',
  };

  // ステートの初期化？
  const {
    getAccessTokenWithPopup,
    getIdTokenClaims,
    logout: auth0Logout,
  } = useAuth0();
  const [idToken, setIdToken] = useState<string>();
  const [profile, setProfile] = useState<Object>(); // idTokenをパースしたやつ
  const [accessToken, setAccessToken] = useState<string>();
  const [accessInfo, setAccessInfo] = useState<Object>(); // accessTokenをパースしたやつ

  // idToken取得〜パースするまでの処理まとめたやつ
  const setUpIdToken = async () => {
    const idTokenClaims = await getIdTokenClaims(AUTH0_PARAM);
    const jwt = idTokenClaims.__raw;
    setIdToken(jwt);
    const decoded = jwtDecode(jwt);
    if (typeof decoded === 'object') setProfile(decoded || {});
  };

  // accessToken取得〜パースするまでの処理まとめたやつ
  const setUpAccessToken = async () => {
    const resp = await getAccessTokenWithPopup(AUTH0_PARAM);
    setAccessToken(resp);
    const decoded = jwtDecode(resp);
    if (typeof decoded === 'object') setAccessInfo(decoded || {});
  };

  const login = useCallback(async () => {
    await setUpAccessToken();
    try {
      await setUpIdToken();
    } catch (e) {
      console.log(e);
    }
  }, []);

  const logout = useCallback(() => {
    auth0Logout({
      returnTo: process.env.NEXT_PUBLIC_AUTH0_LOGOUT_URI,
    });
  }, []);

  // useMemoってなに？
  useMemo(async () => {
    try {
      await setUpIdToken();
    } catch (e) {
      console.log(e);
    }
  }, []);

  return (
    <>
      <Head>
        <title>JWT返すくん</title>
      </Head>
      {!profile && (
        <>
          Not logged in <br />
          <button onClick={login}>LOG IN</button>
        </>
      )}
      {profile && (
        <>
          <button onClick={logout}>LOG OUT</button>
          <br />
          <hr />
          <br />
          Decoded idToken
          <pre>{JSON.stringify(profile, null, 4)}</pre>
          <div>
            <CopyToClipboard text={`Bearer ${idToken}`} onCopy={notify}>
              <button>Copy JWT as bearer token</button>
            </CopyToClipboard>
          </div>
          <ToastContainer />
          <br />
          <hr />
          <br />
          Decoded accessToken
          <pre>{JSON.stringify(accessInfo, null, 4)}</pre>
          <div>
            <CopyToClipboard text={`Bearer ${accessToken}`} onCopy={notify}>
              <button>Copy JWT as bearer token</button>
            </CopyToClipboard>
          </div>
          <ToastContainer />
        </>
      )}
    </>
  );
};

export default Page;
