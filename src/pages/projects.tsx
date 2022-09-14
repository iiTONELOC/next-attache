import Head from 'next/head';
import { Project } from '../components';
import { useEffect, useState } from 'react';
import GitHubAPI from '../../lib/GitHubAPI';
import DefaultUserSettings from '../../attache-defaults.json';

const pageStyles = {
    main: 'w-full h-full flex flex-wrap flex-row justify-center gap-x-10 items-center mb-10 rounded-b-lg',
    projectSection: 'w-4/6 md:w-3/6 lg:w-4/6 h-full grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-2 hover:gap-4 mt-5',
    div: 'text-white text-2xl text-center h-full'

};

type propTypes = {
    avatar_url: string;
    pinnedRepoNames: string[];
};

const Projects = (props: propTypes): JSX.Element | null => {
    const { avatar_url, pinnedRepoNames } = props;
    const [isMounted, setIsMounted] = useState<boolean | null>(null);

    useEffect(() => {
        setIsMounted(true);
        return () => setIsMounted(null);
    }, []);

    if (!isMounted) {
        return null;
    }



    return (
        <main className={pageStyles.main}>
            <Head>
                <title>{`${DefaultUserSettings.name}'s Portfolio - Projects`}</title>
                <link rel="icon" href={avatar_url} />
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>

            <section className={pageStyles.projectSection}>
                {pinnedRepoNames.map((repoName, index) => {
                    return (
                        <div className={pageStyles.div} key={index}>
                            <Project projectName={repoName} />
                        </div>
                    );
                })}
            </section>
        </main>
    );
};

export async function getStaticProps() {
    const gitHubApi = new GitHubAPI();
    const pinnedRepoNames = await gitHubApi.getPinnedRepoNames();
    const { data } = await gitHubApi.getAvatarURL();
    const repoNames = pinnedRepoNames.data;
    return {
        props: {
            avatar_url: data?.avatar_url || '/images/default-img.jpg',
            pinnedRepoNames: repoNames
        }
    };
}

export default Projects;
