import '../styles/globals.css';
import { Layout } from '../components';
import type { AppProps } from 'next/app';
import { ProjectCacheProvider } from '../providers/AttacheProjectCache';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {// NOSONAR

  return (
    <ProjectCacheProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ProjectCacheProvider>
  );
}

export default MyApp;
