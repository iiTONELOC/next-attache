import defaultUserSettings from '../../../attache-defaults.json';
import { useState, useEffect } from 'react';
import WithToolTip from '../WithToolTip';
import { IsMobile } from '../../hooks';
import { MenuIcon } from '../Icons';
import NavLink from '../NavLink';
import Link from 'next/link';

const { navHeading } = defaultUserSettings;

const componentStyles = {
    header: 'bg-zinc-900 w-full h-auto p-2 flex flex-col flex-wrap justify-center items-center gap-y-5 border-b-2 border-purple-900',
    headerResponsive: ' md:flex-row md:justify-between md:items-center',
    name: 'text-white hover:bg-purple-900 text-2xl font-bold bg-black p-3 rounded-md hover:shadow-lg hover:cursor-pointer',
    navBar: 'bg-zinc-900 w-full h-auto p-2 flex flex-col flex-wrap justify-center items-center gap-y-5',
    navBarResponsive: ' md:w-4/6 md:flex-row md:justify-around md:items-center lg:w-3/6 xl:w-2/6',
    navClose: 'flex hover:text-red-600 hover:bg-black hover:rounded-full px-1 pb-1 justify-center items-center ',
    MenuIcon: {
        svg: 'w-8 h-8',
        container: 'hover:animate-spin-slow hover:cursor-pointer hover:text-purple-600'
    }
};


const links: { name: string, to: string }[] = [
    { name: 'About', to: '/' },
    { name: 'Projects', to: '/projects' },
    { name: 'Contact', to: '/contact' },
    { name: 'Resume', to: '/resume' }
];


export default function NavBar(): JSX.Element | null { // NOSONAR
    const [isMounted, setIsMounted] = useState<null | boolean>(null);
    const { isMobile } = IsMobile();
    const [isOpen, setIsOpen] = useState<boolean>(!isMobile);


    useEffect(() => {
        setIsMounted(true);
        setIsOpen(!isMobile);
        return () => {
            setIsMounted(null);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (isMounted) {
            setIsOpen(!isMobile);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMobile]);

    if (!isMounted) {
        return null;
    }

    return (
        <header className={componentStyles.header + componentStyles.headerResponsive}>
            {
                isOpen ? (
                    <>
                        <Link href={'/'}>
                            <h1 className={componentStyles.name}>{navHeading}</h1>
                        </Link>
                        <nav className={componentStyles.navBar + componentStyles.navBarResponsive}>
                            {links.map(el => <NavLink linkName={el.name} to={el.to} key={el.name} />)}
                        </nav>
                        {isMobile && isOpen && (
                            <WithToolTip tip='Click to close nav'>
                                <button
                                    className={componentStyles.navClose}
                                    onClick={() => setIsOpen(false)}
                                >
                                    <p>&#128473;</p>
                                </button>
                            </WithToolTip>

                        )}
                    </>
                ) :
                    (
                        <span
                            className={componentStyles.MenuIcon.container}
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            <MenuIcon svg={{ className: componentStyles.MenuIcon.svg }} />
                        </span>
                    )
            }
        </header>
    );
}
