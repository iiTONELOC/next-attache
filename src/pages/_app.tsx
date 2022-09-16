import '../styles/globals.css';
import { Layout } from '../components';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {// NOSONAR



  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
