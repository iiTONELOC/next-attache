import Head from 'next/head';
import { useIsMounted } from '../../hooks';
import GitHubAPI from '../../../lib/GitHubAPI';
import { Projects as ProjectsComponent } from '../../components';
import DefaultUserSettings from '../../../attache-defaults.json';

export const styles = {
    main: 'w-full h-full flex flex-wrap flex-row justify-center gap-x-10 items-center mb-10 rounded-b-lg',
};


type propTypes = {
    pinnedRepoNames: string[];
};

const Projects = (props: propTypes): JSX.Element | null => {
    const isMounted = useIsMounted();
    const { pinnedRepoNames } = props;


    if (!isMounted) {
        return null;
    }

    return (
        <main className={styles.main}>
            <Head>
                <title>{`${DefaultUserSettings.name}'s Portfolio - Projects`}</title>
            </Head>

            <ProjectsComponent names={pinnedRepoNames} />
        </main>
    );
};

export async function getStaticProps() {
    const gitHubApi = new GitHubAPI();
    const pinnedRepoNames = await gitHubApi.getPinnedRepoNames();
    const repoNames = pinnedRepoNames.data;

    return {
        props: {
            pinnedRepoNames: repoNames
        }
    };
}

export default Projects;
