import Head from 'next/head';
import { useIsMounted } from '../../hooks';
import GitHubAPI from '../../../lib/GitHubAPI';
import DefaultUserSettings from '../../../attache-defaults.json';

export default function Dashboard(props: { avatar_url: string }): JSX.Element | null {
    const isMounted = useIsMounted();

    if (!isMounted) {
        return null;
    }

    return (
        <main>
            <Head>
                <title>{`${DefaultUserSettings.name}'s Portfolio - Admin Dashboard`}</title>
                <link rel="icon" href={props?.avatar_url} />
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>

            <h1>Dashboard</h1>
        </main>
    );
}

export async function getStaticProps() {
    const gitHubApi = new GitHubAPI();
    const { data } = await gitHubApi.getAvatarURL();

    return {
        props: { avatar_url: data?.avatar_url }
    };
}

