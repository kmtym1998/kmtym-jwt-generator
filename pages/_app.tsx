import { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import { Auth0Provider } from '@auth0/auth0-react';
import AppHeader from '../components/app-header';
import '../styles/global.css';

const App = ({ Component, pageProps }: AppProps) => {
  const SafeHydrate = dynamic(() => import('../components/SafeHydrate'), {
    ssr: false,
  });

  return (
    <Auth0Provider
      domain={String(process.env.NEXT_PUBLIC_AUTH0_DOMAIN)}
      clientId={String(process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID)}
      redirectUri={String(process.env.NEXT_PUBLIC_AUTH0_LOGOUT_URI)}
    >
      <SafeHydrate>
        <AppHeader></AppHeader>
        <main>
          <Component {...pageProps} />
        </main>
      </SafeHydrate>
    </Auth0Provider>
  );
};

export default App;
