import Head from 'next/head';
import { Resume } from '../../components';
import { useIsMounted } from '../../hooks';
import DefaultUserSettings from '../../../attache-defaults.json';



const styles = {
    main: 'w-full h-full flex flex-col justify-center items-center my-10',
};

const ResumePage = (): JSX.Element => { // NOSONAR
    const isMounted = useIsMounted();

    return isMounted ? (
        <main className={styles.main}>
            <Head>
                <title>{`${DefaultUserSettings.name}'s Portfolio - Resume`}</title>
            </Head>


            <Resume />

        </main>
    ) : <></>;
};




export default ResumePage;
