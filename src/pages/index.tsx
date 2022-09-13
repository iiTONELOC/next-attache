import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import DefaultUserSettings from '../../attache-defaults.json';
import GitHubAPI from '../../lib/GitHubAPI';


const pageStyles = {
    main: 'w-full h-full flex flex-col justify-start gap-y-10 items-center mb-10 rounded-b-lg',
    avatarSection: 'w-full flex flex-row justify-center items-center mt-8 p-3 text-center gap-1',
    aboutSection: 'w-full flex flex-wrap flex-column justify-center items-center gap-y-5 p-2  ',
    aboutHeading: 'w-full text-4xl text-gray-200 font-bold text-center',
    aboutContent: 'w-5/6 md:w-4/6 text-gray-100 lg:w-3/6 2xl: text-xl text-justify tracking-wide',
    imgSpan: 'bg-zinc-800 rounded-full -ml-2 -mr-1',
    codeText: 'text-8xl md:text-9xl text-purple-600',
    imgWidth: 200,
    imgHeight: 200
};

const About = (props: { avatar_url: string }): JSX.Element | null => {
    const [isMounted, setIsMounted] = useState<boolean | null>(null);
    const [isHovered, setIsHovered] = useState<boolean>(false);

    useEffect(() => {
        setIsMounted(true);
        return () => setIsMounted(null);
    }, []);

    if (!isMounted) {
        return null;
    }

    const handleHover = (): void => setIsHovered(!isHovered);

    return (
        <main className={pageStyles.main}>
            <Head>
                <title>{`${DefaultUserSettings.name}'s Portfolio - About`}</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <section className={pageStyles.avatarSection}>
                <p className={pageStyles.codeText + ' ml-5'}>{'<'}</p>
                <span className={pageStyles.imgSpan}>
                    <Image
                        alt='Avatar'
                        width={pageStyles.imgWidth}
                        height={pageStyles.imgHeight}
                        className='rounded-full'
                        src={props?.avatar_url}
                        onMouseEnter={handleHover}
                        onMouseLeave={handleHover}
                    />
                </span>
                <p className={pageStyles.codeText}>{'/'}</p>
                <p className={pageStyles.codeText + ' -ml-3'}>{'>'}</p>
            </section>

            <section className={pageStyles.aboutSection}>
                <h1 className={pageStyles.aboutHeading}>{DefaultUserSettings.aboutHeading || 'About Me'}</h1>
                <p className={pageStyles.aboutContent}>{DefaultUserSettings.about || 'Missing Defaults!'}</p>
            </section>
        </main>
    );
};

export async function getStaticProps() {
    const gitHubApi = new GitHubAPI();
    const { data } = await gitHubApi.getAvatarURL();
    return {
        props: { avatar_url: data?.avatar_url || 'https://placeholder.pics/svg/200x200/0F0F0F-7431A3/D1D1D1-111111/Loading' } // will be passed to the page component as props
    };
}


export default About;
