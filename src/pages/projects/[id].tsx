import Head from 'next/head';
import styles from './styles';
import { useIsMounted } from '../../hooks';
import { Projects as ProjectsComponent } from '../../components';
import DefaultUserSettings from '../../../attache-defaults.json';
import { getAttacheById } from '../../../lib/db/controller/Attache';


type propTypes = {
    projectNames: string[];
};

const FeaturedAttacheProjects = (props: propTypes): JSX.Element | null => {
    const isMounted = useIsMounted();
    const { projectNames } = props;


    if (!isMounted) {
        return null;
    }

    return (
        <main className={styles.main}>
            <Head>
                <title>{`${DefaultUserSettings.name}'s Portfolio - Projects`}</title>
            </Head>

            <ProjectsComponent names={projectNames} />
        </main>
    );
};

export async function getServerSideProps(context: any) {
    const id = context?.query?.id;

    const attacheData = await getAttacheById(id);
    const projectNames = attacheData?.projects.map((el: any) => el.name);

    if (!attacheData) {
        return {
            notFound: true
        };
    }
    return {
        props: {
            projectNames
        }
    };
}

export default FeaturedAttacheProjects;
