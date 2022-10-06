import Head from 'next/head';
import API from '../../utils/API';
import { NavBar, Footer } from '../index';
import { useEffect, useState } from 'react';
import { useIsMounted } from '../../hooks';
import defaultUserSettings from '../../../attache-defaults.json';

const { name, portfolioTitle } = defaultUserSettings;

export type LayoutProps = {
    children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps): JSX.Element {
    const [avatarSrc, setAvatarSrc] = useState<string>('');
    const isMounted = useIsMounted();

    const getAndSetAvatar = (): void => {
        API.getAvatar().then(d => {
            const url = d?.avatar_url;
            const currUrl = avatarSrc;

            if (url && url !== currUrl) {
                setAvatarSrc(d.avatar_url);
                localStorage.setItem('portfolioAvatarSrc', url);
            }
        });
    };

    useEffect(() => {
        const cacheSrc = localStorage.getItem('portfolioAvatarSrc');
        cacheSrc && setAvatarSrc(cacheSrc);

        isMounted && getAndSetAvatar();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMounted]);

    return (
        <div className='w-full h-screen bg-black overflow-hidden '>
            <Head>
                <title>{portfolioTitle || `${name}'s Portfolio`}</title>
                <meta name="description" content={`Created by ${name}`} />
                <link rel="icon" href={avatarSrc} />
            </Head>
            <section className='w-full h-screen flex flex-wrap flex-row justify-center items-start overflow-y-auto'>
                <div className='w-full h-auto'><NavBar /></div>
                <div className='w-full h-auto'>{children}</div>
                <div className='w-full h-auto self-end'><Footer /></div>
            </section>
        </div>
    );
}
