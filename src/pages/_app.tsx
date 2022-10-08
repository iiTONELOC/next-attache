import '../styles/globals.css';
import { Layout } from '../components';
import type { AppProps } from 'next/app';
import { VersionProvider, ProjectCacheProvider } from '../providers';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {// NOSONAR

  return (
    <VersionProvider>
      <ProjectCacheProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ProjectCacheProvider>
    </VersionProvider>

  );
}

export default MyApp;
