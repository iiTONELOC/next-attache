import Head from 'next/head';
import { NavBar, Footer } from '../index';
import { useIsMounted } from '../../hooks';
import React, { ReactNode, useEffect, useState } from 'react';
import defaultUserSettings from '../../../attache-defaults.json';
import { AttacheListStateProvider, useAvatarState } from '../../providers';

const { name, portfolioTitle } = defaultUserSettings;

export type LayoutProps = {
    children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps): JSX.Element {
    const [useProvider, setUseProvider] = useState<boolean>(false);
    const [avatarSrc,] = useAvatarState();
    const isMounted = useIsMounted();

    useEffect(() => {
        const location = window.location;
        setUseProvider(location.href.includes('admin/dashboard'));
    }, [children]);

    function renderProvider(children: ReactNode) {
        return useProvider ? <AttacheListStateProvider>{children}</AttacheListStateProvider>
            : children;
    }

    return (
        <div className='w-full h-screen bg-black overflow-hidden '>
            <Head>
                <title>{portfolioTitle || `${name}'s Portfolio`}</title>
                <meta name="description" content={`Created by ${name}`} />
                <link rel="icon" href={avatarSrc} />
            </Head>
            <section className='w-full h-screen flex flex-wrap flex-row justify-center items-start overflow-y-auto'>
                <div className='w-full h-auto'><NavBar /></div>
                <div className='w-full h-auto]'>
                    {isMounted && renderProvider(children)}
                </div>
                <div className='w-full h-auto self-end'><Footer /></div>
            </section>
        </div>
    );
}
