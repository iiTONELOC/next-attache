import { getAttacheIds } from '../../../../lib/db/controller/Attache';
import DefaultUserSettings from '../../../../attache-defaults.json';
import { useIsMounted } from '../../../hooks';

import Head from 'next/head';


export type attachePageProps = {
    id: string[];
};

export default function Attaches(props: attachePageProps): JSX.Element { //NOSONAR
    const isMounted = useIsMounted();
    return isMounted ? (

        <>
            <Head>
                <title>{`${DefaultUserSettings.name}'s Portfolio - Attachés`}</title>
            </Head>
            Coming Soon
        </>
    ) : <></>;
}

export async function getServerSideProps(context: object) {
    const attacheIds = await getAttacheIds();

    return {
        props: {
            id: attacheIds.map(el => String(el?._id))
        }
    };
}
