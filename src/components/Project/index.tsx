import Image from 'next/image';
import { useEffect, useState } from 'react';
import type { repoData } from '../../pages/api/repo/[name]';
import API from '../../utils/API';


export default function Project(props: { projectName: string }): JSX.Element | null {// NOSONAR
    const [isMounted, setIsMounted] = useState<boolean | null>(null);
    const [data, setData] = useState<repoData | null>(null);
    useEffect(() => {
        setIsMounted(true);
        return () => setIsMounted(null);
    }, []);

    useEffect(() => {
        if (isMounted) {
            (async () => {
                try {
                    const response = await API.getRepo(props.projectName);
                    setData(response.data);
                } catch (error) {
                    console.error(error);
                }
            })();
        }
    }, [isMounted, props.projectName]);

    if (!isMounted || !data) {
        return null;
    }

    const { projectName } = props;
    return (
        <article>
            <h1>{projectName}</h1>
            <Image
                width={50}
                height={50}
                src={data?.screenshotURL || ''}
                alt={projectName}
            />
        </article>

    );
}
