import type { apiResponseData, errorType, repoData } from '../../types';
import { useIsMounted, useHovered } from '../../hooks';
import { IoRocketOutline } from 'react-icons/io5';
import { BiMoviePlay } from 'react-icons/bi';
import { VscGithub } from 'react-icons/vsc';
import { useEffect, useState } from 'react';
import API from '../../utils/API';
import Image from 'next/image';

const footerIconClasses = 'text-2xl text-purple-500 hover:text-gray-300 hover:scale-110 transition duration-300 ease-in-out';

interface FooterIcons {
    icon: JSX.Element;
    name: string;
    href?: string;
}

const formatRepoName: Function = (repoName: string): string => {
    // split the name on any hyphens or underscores
    // and capitalize the first letter of each word

    const delimiter: '_' | '-' = repoName.includes('_') ? '_' : '-';
    const splitName: string[] = repoName.split(delimiter);

    return splitName.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

export default function Project(props: { projectName: string }): JSX.Element | null {// NOSONAR
    const [apiData, setApiData] = useState<repoData | null>(null);
    const [errors, setErrors] = useState<errorType>(null);

    const { projectName } = props;
    const isMounted = useIsMounted();
    const { isHovered, handleHover } = useHovered();

    const { screenshotUrl, description, demoUrl, liveUrl, repoUrl } = apiData || {};

    // Fetch data from API
    useEffect(() => {
        if (isMounted) {
            (async () => {
                try {
                    const response: apiResponseData = await API.getRepo(props.projectName);
                    const { data, error } = response;
                    data && setApiData(data);
                    if (error) {
                        /*@ts-ignore*/
                        throw new Error(error?.message || 'An error occurred');
                    }

                } catch (error) {
                    setErrors(`Could not fetch repo data for ${projectName}: ` + error);
                }
            })();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMounted, projectName]);

    if (!isMounted) {
        return null;
    }

    // needs access to the destructured api data
    const footerIcons: FooterIcons[] = [
        { name: 'deployment', icon: <IoRocketOutline className={footerIconClasses} />, href: liveUrl },
        { name: 'demo', icon: <BiMoviePlay className={footerIconClasses} />, href: demoUrl },
        { name: 'GitHub repo', icon: <VscGithub className={footerIconClasses} />, href: repoUrl }
    ];

    const emeraldOnHover = isHovered ? 'text-emerald-400' : '';

    return (
        <article
            className={`w-full h-full hover:bg-zinc-800 bg-zinc-800/75 hover:scale-105 rounded-lg p-2 flex flex-col justify-start items-center`}
            onMouseEnter={handleHover}
            onMouseLeave={handleHover}
        >
            {/* Title */}
            <h1 className={'decoration-gray-400 underline underline-offset-4 text-gray-100 my-2  ' + emeraldOnHover} >{formatRepoName(projectName)}</h1>


            {!errors ? (
                <section className='h-full bg-zinc-900/80 w-full flex flex-wrap flex-row justify-center items-center rounded-md text-gray-200'>
                    {/* Image container */}
                    <div className='w-full  p-1 h-40 overflow-hidden  rounded-t-md'>
                        <div className='relative h-[152px] overflow-hidden rounded-t-md'>
                            {typeof window !== 'undefined' ? (
                                <Image
                                    className='text-base'
                                    objectFit='cover'
                                    layout='fill'
                                    src={screenshotUrl || '/images/default-img.jpg'}
                                    alt={projectName}
                                />
                            ) :
                                (<p>Loading...</p>)
                            }
                        </div>
                    </div>

                    {/* Description container */}
                    <section className='w-5/6 flex flex-wrap flex-row justify-center items-center'>
                        <p className='tracking-wide text-justify p-2 text-base text-gray-300'>{description}</p>
                    </section>

                    {/* Card footer with icons */}
                    <footer className='bg-black/20 w-full self-end rounded-b-md'>
                        <section className='flex flex-row justify-evenly items-center w-full p-2'>
                            {
                                footerIcons.map(({ icon, name, href }, index) => {

                                    return (
                                        href && href !== '' && (
                                            <a
                                                key={index}
                                                href={href}
                                                target='_blank'
                                                rel='noreferrer'
                                            >
                                                {icon}
                                            </a>
                                        )
                                    )
                                })
                            }
                        </section>
                    </footer>
                </section>
            ) : (

                <p>{errors}</p>
            )}
        </article>
    );
}
