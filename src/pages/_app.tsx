import '../styles/globals.css';
import { Layout } from '../components';
import type { AppProps } from 'next/app';
import { VersionProvider, ProjectCacheProvider, AvatarProvider } from '../providers';


function MyApp({ Component, pageProps }: AppProps): JSX.Element {// NOSONAR

  return (
    <VersionProvider>
      <ProjectCacheProvider>
        <AvatarProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </AvatarProvider>
      </ProjectCacheProvider>
    </VersionProvider>

  );
}

export default MyApp;
