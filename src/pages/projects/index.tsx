import Head from 'next/head';
import { repoData } from '../../types';
import { useIsMounted } from '../../hooks';
import GitHubAPI from '../../../lib/GitHubAPI';
import { Loading, ProjectCard } from '../../components';
import DefaultUserSettings from '../../../attache-defaults.json';
import { handleProjectLookUp } from '../api/repo/[name]';
import { NextApiRequest } from 'next';
import { updateDBNonBlocking } from '../../utils/UpdateDb';

class ProjectCache {
    projects: { data: repoData; timestamp: number }[] = [];
}

const projectCache = new ProjectCache();

export const styles = {
    main: 'w-full h-full flex flex-wrap flex-row justify-center gap-x-10 items-center mb-10 rounded-b-lg',

    projectSection: 'w-4/6 md:w-3/6 lg:w-4/6 h-full grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 hover:gap-4 mt-5',
    div: 'text-white text-2xl text-center h-full'
};


type propTypes = {
    pinnedRepoData: repoData[];
};



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

export async function getServerSideProps() {
    const pinnedRepoNames = await GitHubAPI.getPinnedRepoNames();
    const repoNames = pinnedRepoNames.data;


    const repoData = await Promise.all(repoNames.map(async (repoName: string) => {
        const req = {
            method: 'GET',
            query: {
                name: repoName
            }
        };
        const res = {
            status: (code: number) => {
                return {
                    json: (data: any) => {
                        return {
                            code,
                            data
                        };
                    }
                };
            }
        };

        // check if the project is cached
        const cachedProject = projectCache.projects.find(project => project.data.name === repoName);

        async function lookupProject() {
            // @ts-ignore
            const { data } = await handleProjectLookUp(req as unknown as NextApiRequest, res as unknown);
            // cache each project
            // @ts-ignore
            projectCache.projects.push({
                data: {
                    ...data.data._doc,
                    _id: data.data._doc._id.toString()
                }, timestamp: Date.now()
            });
            return {
                ...data.data._doc,
                _id: data.data._doc._id.toString()
            };
        }

        if (cachedProject) {
            // check if the cached project is older than 5 minutes
            if (Date.now() - cachedProject.timestamp > 300000) {
                // update but dont wait for it
                updateDBNonBlocking(repoName);
                return cachedProject.data;
            } else {
                return cachedProject.data;
            }
        } else {
            return lookupProject();
        }


    }));

    return {
        props: {
            // pinnedRepoNames: repoNames
            pinnedRepoData: repoData
        }
    };
}

export default Projects;
