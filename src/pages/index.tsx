import Head from 'next/head';
import Image from 'next/image';
import { Suspense } from 'react';
import { useIsMounted } from '../hooks';
import { useAvatarState } from '../providers';
import DefaultUserSettings from '../../attache-defaults.json';


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

const About = (): JSX.Element => { // NOSONAR
    const isMounted = useIsMounted();
    const [avatarUrl] = useAvatarState();

    return isMounted ? (
        <main className={pageStyles.main}>
            <Head>
                <title>{`${DefaultUserSettings.name}'s Portfolio - About`}</title>
            </Head>

            {/* Avatar with < /> */}
            <section className={pageStyles.avatarSection}>
                <p className={pageStyles.codeText + ' ml-5'}>{'<'}</p>
                <span className={pageStyles.imgSpan}>
                    <Suspense>
                        <Image
                            alt='Avatar'
                            priority={true}
                            width={pageStyles.imgWidth}
                            height={pageStyles.imgHeight}
                            className='rounded-full'
                            src={avatarUrl !== '' ? avatarUrl : '/images/default-img.jpg'}
                        />
                    </Suspense>
                </span>
                <p className={pageStyles.codeText}>{'/'}</p>
                <p className={pageStyles.codeText + ' -ml-3'}>{'>'}</p>
            </section>

            {/* About Me */}
            <section className={pageStyles.aboutSection}>
                <h1 className={pageStyles.aboutHeading}>{
                    DefaultUserSettings.aboutHeading || 'About Me'
                }</h1>

                <p className={pageStyles.aboutContent}>{
                    DefaultUserSettings.about || 'Missing Defaults!'
                }</p>
            </section>
        </main>
    ) : <></>;
};



export default About;
