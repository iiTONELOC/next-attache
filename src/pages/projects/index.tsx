import Head from 'next/head';
import { repoData } from '../../types';
import { useIsMounted } from '../../hooks';
import GitHubAPI from '../../../lib/GitHubAPI';
import { useState, useEffect } from 'react';
import { Loading, ProjectCard } from '../../components';
import DefaultUserSettings from '../../../attache-defaults.json';


export const styles = {
    main: 'w-full h-full flex flex-wrap flex-row justify-center gap-x-10 items-center mb-10 rounded-b-lg',

    projectSection: 'w-4/6 md:w-3/6 lg:w-4/6 h-full grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 hover:gap-4 mt-5',
    div: 'text-white text-2xl text-center h-full'
};


type propTypes = {
    repoNames: string[];
};


const fetchRepoProjectData = async (repoNames: string[]) => {
    const data = Promise.all(repoNames.map(async (repoName: string) => await fetchProjectData(repoName)));
    const repoData = await data
        .then(results => results)
    return repoData;
};

const fetchProjectData = async (repoName: string) => {
    const req = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_GIT_HUB_ACCESS_TOKEN
        },
        query: {
            name: repoName
        }
    };
    const res = await fetch(`/api/repo/${repoName}`, req);

    const data = await res.json();
    return data;
};

const Projects = (props: propTypes): JSX.Element | null => {
    const isMounted = useIsMounted();
    const [pinnedRepoData, setPinnedRepoData] = useState<null | any[]>(null);

    const { repoNames } = props;

    useEffect(() => {
        isMounted && repoNames && (async () => {
            const repoData = await fetchRepoProjectData(repoNames)
            setPinnedRepoData(repoData)
        })();
    }, [repoNames, isMounted]);



    if (!isMounted) {
        return <main className={styles.main}>
            <Head>
                <title>{`${DefaultUserSettings.name}'s Portfolio - Projects`}</title>
            </Head>

            <section className={styles.projectSection}>
                <Loading />
            </section>
        </main>;
    }

    return (
        <main className={styles.main}>
            <Head>
                <title>{`${DefaultUserSettings.name}'s Portfolio - Projects`}</title>
            </Head>
            <section className={styles.projectSection}>
                {pinnedRepoData?.map((project: { data: repoData }) => {
                    return (
                        <div className={styles.div} key={`${project.data.name}`}>
                            <ProjectCard data={project.data} />
                        </div>
                    );
                })}
            </section>
        </main>
    );
};


export async function getServerSideProps() {
    const pinnedRepoNames = await GitHubAPI.getPinnedRepoNames();
    const repoNames = pinnedRepoNames.data;

    return {
        props: {
            repoNames
        }
    };
}


export default Projects;
