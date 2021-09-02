import Head from 'next/head';
import { useCallback, useState, useMemo } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import jwtDecode from 'jwt-decode';

import { Button, Typography } from '@material-ui/core';

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
  const [profile, setProfile] = useState<any>(); // idTokenをパースしたやつ
  const [accessToken, setAccessToken] = useState<string>();
  const [accessInfo, setAccessInfo] = useState<any>(); // accessTokenをパースしたやつ

  // idToken取得〜パースするまでの処理まとめたやつ
  const setUpIdToken = async () => {
    const idTokenClaims = await getIdTokenClaims(AUTH0_PARAM);
    const jwt = idTokenClaims.__raw;
    setIdToken(jwt);
    const decoded = jwtDecode(jwt);
    setProfile(decoded);
  };

  // accessToken取得〜パースするまでの処理まとめたやつ
  const setUpAccessToken = async () => {
    const resp = await getAccessTokenWithPopup(AUTH0_PARAM);
    setAccessToken(resp);
    const decoded = jwtDecode(resp);
    setAccessInfo(decoded);
  };

  // ログインユーザが小松山かどうか (ガバガバ)
  const kmtym = (): Boolean => {
    if (!profile) return false;
    if (profile?.nickname?.indexOf('kmtym') !== -1) return true;
    if (profile?.nickname?.indexOf('r.komatsuyama') !== -1) return true;

    return false;
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
        <title>JWT Generator</title>
      </Head>
      {!profile && (
        <>
          <Typography variant="h1" className={'title'}>
            Not logged in
          </Typography>
          <br />
          <Button variant="contained" className={'btn-login'} onClick={login}>
            LOG IN
          </Button>
        </>
      )}
      {profile && (
        <>
          <Button variant="outlined" className={'btn-logout'} onClick={logout}>
            LOG OUT
          </Button>
          <br />
          <hr />
          <br />
          <Typography gutterBottom variant="h2" className={'title'}>
            Decoded payload (idToken)
          </Typography>
          <pre>{JSON.stringify(profile, null, 4)}</pre>
          <div>
            <Typography variant="subtitle1">Copy as ...</Typography>
            <CopyToClipboard text={`Bearer ${idToken}`} onCopy={notify}>
              <Button variant="contained" className={'btn-copy-jwt'}>
                bearer token
              </Button>
            </CopyToClipboard>
            <CopyToClipboard
              text={JSON.stringify(profile, null, 4)}
              onCopy={notify}
            >
              <Button variant="contained" className={'btn-copy-jwt'}>
                JSON
              </Button>
            </CopyToClipboard>
          </div>
          <ToastContainer />
          <br />
          <hr />
          <br />
          <Typography gutterBottom variant="h2" className={'title'}>
            Decoded payload (accessToken)
          </Typography>
          <pre>{JSON.stringify(accessInfo, null, 4)}</pre>
          <div>
            <Typography variant="subtitle1">Copy as ...</Typography>
            <CopyToClipboard text={`Bearer ${accessToken}`} onCopy={notify}>
              <Button variant="contained" className={'btn-copy-jwt'}>
                bearer token
              </Button>
            </CopyToClipboard>
            <CopyToClipboard
              text={JSON.stringify(accessInfo, null, 4)}
              onCopy={notify}
            >
              <Button variant="contained" className={'btn-copy-jwt'}>
                JSON
              </Button>
            </CopyToClipboard>
          </div>
          <ToastContainer />
        </>
      )}

      {kmtym() && (
        <footer>
          <br />
          <hr />
          <br />
          <Typography gutterBottom variant="h3">
            You are qualified
          </Typography>
          <div>
            <li>
              <a
                href="https://vercel.com/kmtym1998/kmtym-jwt-generator"
                target="_blank"
              >
                vercel
              </a>
            </li>

            <li>
              <a
                href="https://manage.auth0.com/dashboard/jp/kmtym-jwt-generator/rules/rul_lrII5L8l3FN9GKHY"
                target="_blank"
              >
                Auth0 | Auth Pipeline | Rules | private-claim-creator
              </a>
            </li>

            <li>
              <a
                href="https://manage.auth0.com/dashboard/jp/kmtym-jwt-generator/users"
                target="_blank"
              >
                Auth0 | Users
              </a>
            </li>

            <li>
              <a
                href="https://manage.auth0.com/dashboard/jp/kmtym-jwt-generator/applications/bDNkJDZdbZ9AIUKhLLcTEMNg1Q0XkJSv/settings"
                target="_blank"
              >
                Auth0 | Applications | front
              </a>
            </li>
          </div>
        </footer>
      )}
    </>
  );
};

export default Page;
