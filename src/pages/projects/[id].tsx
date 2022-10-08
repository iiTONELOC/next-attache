import Head from 'next/head';
import styles from './styles';
import { useEffect } from 'react';
import { useIsMounted } from '../../hooks';
import { Projects as ProjectsComponent } from '../../components';
import DefaultUserSettings from '../../../attache-defaults.json';
import { getAttacheById } from '../../../lib/db/controller/Attache';


type propTypes = {
    projectNames: string[];
    versionId: string;
};

const FeaturedAttacheProjects = (props: propTypes): JSX.Element | null => {
    const isMounted = useIsMounted();
    const { projectNames, versionId } = props;


    useEffect(() => {
        if (isMounted) {
            localStorage.setItem('attacheVersion', versionId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMounted, versionId]);

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
            projectNames,
            versionId: id
        }
    };
}

export default FeaturedAttacheProjects;
