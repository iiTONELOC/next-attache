import Head from 'next/head';
import { NextApiRequest } from 'next';
import { repoData } from '../../types';
import { useIsMounted } from '../../hooks';
import GitHubAPI from '../../../lib/GitHubAPI';
import { Loading, ProjectCard } from '../../components';
import { handleProjectLookUp } from '../api/repo/[name]';
import DefaultUserSettings from '../../../attache-defaults.json';


export const styles = {
    main: 'w-full h-full flex flex-wrap flex-row justify-center gap-x-10 items-center mb-10 rounded-b-lg',

    projectSection: 'w-4/6 md:w-3/6 lg:w-4/6 h-full grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 hover:gap-4 mt-5',
    div: 'text-white text-2xl text-center h-full'
};


type propTypes = {
    pinnedRepoData: repoData[];
};

if (typeof window === 'undefined') {
    import('../../utils/UpdateDb');
}



const Projects = (props: propTypes): JSX.Element | null => {
    const isMounted = useIsMounted();
    const { pinnedRepoData } = props;


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
                {pinnedRepoData?.map((project, index) => {
                    return (
                        <div className={styles.div} key={`${project.name}-${index}`}>
                            <ProjectCard data={project} />
                        </div>
                    );
                })}
            </section>
        </main>
    );
};



// Helper function to fetch project data
async function fetchProjectData(repoName: string) {
    const req = {
        method: 'GET',
        query: {
            name: repoName
        }
    };
    const res = {
        status: (code: number) => ({
            json: (data: any) => ({
                code,
                data
            })
        })
    };
    // @ts-ignore
    const { data } = await handleProjectLookUp(req as unknown as NextApiRequest, res as unknown);
    return {
        ...data.data._doc,
        _id: data.data._doc._id.toString()
    };
}


export async function getServerSideProps() {
    const pinnedRepoNames = await GitHubAPI.getPinnedRepoNames();
    const repoNames = pinnedRepoNames.data;

    // Fetch uncached project data in parallel
    const data = repoNames.map(async (repoName: string) => fetchProjectData(repoName));

    const repoData = await Promise.allSettled(data)
        .then(results => results
            .map(result => result.status === 'fulfilled' ? result.value : null)
            .filter(data => data !== null));
    return {
        props: {
            pinnedRepoData: repoData
        }
    };
}


export default Projects;
