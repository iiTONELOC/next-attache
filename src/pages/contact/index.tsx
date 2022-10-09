import Head from 'next/head';
import styles from './styles';
import { useIsMounted } from '../../hooks';
import DefaultUserSettings from '../../../attache-defaults.json';
import { ContactForm } from '../../components/Forms';


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
