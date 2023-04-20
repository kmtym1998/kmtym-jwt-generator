import Head from 'next/head';
import { useCallback, useState, useMemo } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import jwtDecode from 'jwt-decode';
import { FileCopyOutlined } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import { notify } from '../helpers/notify';
import { useRouter } from 'next/router';
import { parseQueryParams } from '../helpers/parseQueryParams';

const Page = () => {
  // auth0を呼ぶときのパラメータ
  const AUTH0_DOMAIN_NAME = 'kmtym-jwt-generator.jp.auth0.com';

  const router = useRouter();
  const [state] = parseQueryParams(router.query.state);

  const onClickYes = () => {
    if (state)
      location.href = `https://${AUTH0_DOMAIN_NAME}/continue?state=${state}&answer=yes`;
  };
  const onClickNo = () => {
    if (state)
      location.href = `https://${AUTH0_DOMAIN_NAME}/continue?state=${state}&answer=no`;
  };

  return (
    <>
      <Head>
        <title>JWT Generator</title>
      </Head>

      <Box>同意しますか？</Box>

      <br />

      <Box>
        <Button variant="contained" color="primary" onClick={onClickYes}>
          同意する
        </Button>
        <Button variant="contained" color="secondary" onClick={onClickNo}>
          同意しない
        </Button>
      </Box>
    </>
  );
};

export default Page;
