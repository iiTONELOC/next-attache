import { getAttacheById } from '../../../../lib/db/controller/Attache';
import DefaultUserSettings from '../../../../attache-defaults.json';
import ProjectsComponent from '../../../components/Projects';
import { useIsMounted } from '../../../hooks';
import Head from 'next/head';


export type attachePageProps = {
    attache: string;
};

const styles = {
    container: ' flex flex-col items-center justify-start h-full py-2 gap-3 mb-5',
    header: 'w-4/6 flex flex-row justify-between items-end gap-3',
    id: 'hover:scale-105 transform transition duration-300 ease-in-out',
    detailsSection: 'w-full bg-black flex flex-col items-center justify-start p-4',
    headerTitle: 'text-4xl text-gray-200 font-bold',
    detailDiv: 'w-4/6 bg-zinc-900 flex flex-wrap flex-row items-center justify-start mt-5 rounded-md text-justify tracking-wide',
    noteTitle: 'w-full text-2xl font-bold text-gray-300 italic m-2 text-shadow',
    noteText: 'w-full text-xl text-gray-300 m-2 text-shadow',
};

export default function Attache(props: attachePageProps) { //NOSONAR
    const attache = JSON.parse(props?.attache);
    const isMounted = useIsMounted();
    const { name, projects, notes } = attache;
    /*@ts-ignore*/
    const projectNames = projects.map(_project => _project.name);

    return isMounted ? (

        <main className={styles.container}>
            <Head>
                <title>{`${DefaultUserSettings.name}'s Portfolio - Attachés`}</title>
            </Head>


            <section className={styles.detailsSection}>
                <header className={styles.header}>
                    <h1 className={styles.headerTitle}>{name}</h1>
                    <p
                        className={styles.id}
                    >{`id: ${attache._id}`} </p>
                </header>

                <div className={styles.detailDiv}>
                    <h2 className={styles.noteTitle}>Notes: </h2>
                    <p className={styles.noteText}>{notes}</p>
                    {/* TODO: ADD ABILITY TO EDIT NOTES HERE */}
                </div>
            </section>

            <ProjectsComponent names={projectNames} />

        </main>



    ) : <></>;
}

export async function getServerSideProps(context: any) {
    const id = context?.query?.id;

    const attacheData = await getAttacheById(id);

    if (!attacheData) {
        return {
            notFound: true
        };
    }

    return {
        props: {
            attache: JSON.stringify(attacheData),
        }
    };
}
