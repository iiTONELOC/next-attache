import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import DefaultUserSettings from '../../attache-defaults.json';
import GitHubAPI from '../../lib/GitHubAPI';


const pageStyles = {
    main: 'w-full h-full bg-black flex flex-col justify-start gap-y-10 items-center mb-10',
    avatarSection: 'w-full flex flex-row justify-center items-center mt-8 p-3 ',
    aboutSection: 'w-full flex flex-wrap flex-column justify-center items-center gap-y-5 p-2 ',
    aboutHeading: 'w-full text-4xl text-gray-200 font-bold text-center',
    aboutContent: 'w-5/6 text-gray-100 lg:w-4/6 text-xl'
};

const About = (props: { avatar_url: string }): JSX.Element | null => {
    const [isMounted, setIsMounted] = useState<boolean | null>(null);

    useEffect(() => {
        setIsMounted(true);
        return () => setIsMounted(null);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <main className={pageStyles.main}>
            <Head>
                <title>{`${DefaultUserSettings.name}'s Portfolio - About`}</title>
            </Head>
            <section className={pageStyles.avatarSection}>
                <p className='text-8xl md:text-9xl'>{'<'}</p>
                <span className=' bg-zinc-800 rounded-full'>
                    <Image
                        alt='Avatar'
                        width={200}
                        height={200}
                        className='rounded-full'
                        src={props?.avatar_url} />
                </span>
                <p className='text-8xl md:text-9xl'>{'/>'}</p>
            </section>

            <section className={pageStyles.aboutSection}>
                <h1 className={pageStyles.aboutHeading}>Always learning</h1>
                <p className={pageStyles.aboutContent}>{DefaultUserSettings.about}</p>
            </section>

        </main>
    );
};

export async function getStaticProps() {
    const gitHubApi = new GitHubAPI();
    const { data } = await gitHubApi.getAvatarURL();
    return {
        props: { avatar_url: data.avatar_url || 'https://placeholder.pics/svg/200x200/0F0F0F-7431A3/D1D1D1-111111/Loading' } // will be passed to the page component as props
    };
}


export default About;
