import Head from 'next/head';
import { useIsMounted } from '../../hooks';
import DefaultUserSettings from '../../../attache-defaults.json';
import { ContactForm } from '../../components/Forms';

const styles = {
    main: 'w-full h-full flex flex-col items-center justify-center p-2'
};


const Contact = (): JSX.Element => { // NOSONAR
    const isMounted = useIsMounted();

    return (
        isMounted ? (
            <main className={styles.main}>
                <Head>
                    <title>{`${DefaultUserSettings.name}'s Portfolio - Contact`}</title>
                </Head>

                <main className={styles.main}>
                    <ContactForm />
                </main>

            </main>
        ) : <></>
    );
};


export default Contact;
