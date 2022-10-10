import type { errorType, repoData } from '../../types';
import { useIsMounted, useHovered, useProjectData } from '../../hooks';
import { IoRocketOutline } from 'react-icons/io5';
import { BiMoviePlay } from 'react-icons/bi';
import { VscGithub } from 'react-icons/vsc';
import { useEffect, useState } from 'react';

import Image from 'next/image';

const footerIconClasses = 'text-shadow text-2xl text-purple-500 hover:text-gray-300 hover:scale-110 transition duration-300 ease-in-out';

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

export default function ProjectCard( // NOSONAR
    props: {
        projectName?: string,
        project?: repoData,
        dynamic?: boolean
    }
): JSX.Element | null {
    const { data, loading, error } = useProjectData(
        {
            searchByName: props.projectName,
            project: props.project,
            dynamic: props.dynamic
        }
    );
    const [apiData, setApiData] = useState<repoData | null>(null);
    const [errors, setErrors] = useState<errorType>(null);
    const isMounted = useIsMounted();
    const { isHovered, handleHover } = useHovered();

    let { projectName } = props;
    projectName === undefined && (projectName = props?.project?.name);

    const { screenshotUrl, description, demoUrl, liveUrl, repoUrl } = apiData || {};

    // Fetch data from API
    useEffect(() => {
        data && setApiData(data);
    }, [isMounted, data]);

    useEffect(() => {
        error && setErrors(error);
    }, [error]);

    if (!isMounted || loading) {
        return null;
    }

    // needs access to the destructured api data
    const footerIcons: FooterIcons[] = [
        { name: 'deployment', icon: <IoRocketOutline className={footerIconClasses} />, href: liveUrl },
        { name: 'demo', icon: <BiMoviePlay className={footerIconClasses} />, href: demoUrl },
        { name: 'GitHub repo', icon: <VscGithub className={footerIconClasses} />, href: repoUrl }
    ];

    const emeraldOnHover = isHovered ? 'text-emerald-400' : '';

    return isMounted ? (
        <article
            className={`w-full h-full hover:bg-zinc-800 bg-zinc-800/75 hover:scale-105 rounded-lg p-2 flex flex-col justify-start items-center`}
            onMouseEnter={handleHover}
            onMouseLeave={handleHover}
        >
            {/* Title */}
            <h1 className={'decoration-gray-400 underline underline-offset-4 text-gray-100 my-2 text-shadow ' + emeraldOnHover} >{formatRepoName(projectName)}</h1>


            {!errors ? (
                <section className='h-full bg-zinc-900/80 w-full flex flex-wrap flex-row justify-center items-center rounded-md text-gray-200'>
                    {/* Image container */}
                    <div className='w-full  p-1 h-40 overflow-hidden  rounded-t-md'>
                        <div className='relative h-[152px] overflow-hidden rounded-t-md'>
                            <Image
                                priority={true}
                                className='text-base'
                                objectFit='cover'
                                layout='fill'
                                src={screenshotUrl && screenshotUrl !== '' ? screenshotUrl : '/images/default-img.jpg'}
                                alt={projectName}
                            />
                        </div>
                    </div>

                    {/* Description container */}
                    <section className='w-5/6 flex flex-wrap flex-row justify-center items-center'>
                        <p className='tracking-wide text-justify p-2 text-base text-gray-300 text-shadow'>{description}</p>
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
    ) : <></>;
}
