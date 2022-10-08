import defaultUserSettings from '../../../attache-defaults.json';
import { useState, useEffect } from 'react';
import WithToolTip from '../WithToolTip';
import { IsMobile, useAttacheVersion, useIsMounted } from '../../hooks';
import { MenuIcon } from '../Icons';
import Auth from '../../utils/Auth';
import NavLink from '../NavLink';
import Link from 'next/link';

const { navHeading } = defaultUserSettings;

const componentStyles = {
    header: 'bg-zinc-900 w-full h-auto p-2 flex flex-col flex-wrap justify-center items-center gap-y-5 border-b-2 border-purple-900',
    headerResponsive: ' md:flex-row md:justify-between md:items-center',
    name: 'text-shadow text-white hover:bg-purple-900 text-2xl font-bold bg-black p-3 rounded-md hover:shadow-lg hover:cursor-pointer',
    navBar: 'bg-zinc-900 w-full h-auto p-2 flex flex-col flex-wrap justify-center items-center gap-y-5',
    navBarResponsive: ' md:w-4/6 md:flex-row md:justify-around md:items-center lg:w-3/6 xl:w-2/6',
    navClose: 'flex hover:text-red-600 hover:bg-black hover:rounded-full px-1 pb-1 justify-center items-center ',
    MenuIcon: {
        svg: 'w-8 h-8',
        container: 'hover:animate-spin-slow hover:cursor-pointer hover:text-purple-600'
    }
};

type linkType = {
    name: string,
    to?: string,
    onClick?: Function
};



const controlAltL = (e: KeyboardEvent): void => {
    if (e.key === 'l' && e.ctrlKey && e.altKey) {
        // check if we are logged in
        const loggedIn = Auth.loggedIn();
        loggedIn ? Auth.logout() : window.location.replace('/admin/login');
    }
};

export default function NavBar(): JSX.Element | null { // NOSONAR
    const { isMobile } = IsMobile();
    const isMounted = useIsMounted();
    const [isOpen, setIsOpen] = useState<boolean>(!isMobile);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const { attacheVersion } = useAttacheVersion();
    const links: linkType[] = [
        { name: 'About', to: '/' },
        { name: 'Projects', to: attacheVersion ? `/projects/${attacheVersion}` : '/projects' },
        { name: 'Contact', to: '/contact' },
        { name: 'Resume', to: '/resume' }
    ];

    const adminLinks: linkType[] = [
        { name: 'Projects', to: '/projects' },
        { name: 'Dashboard', to: '/admin/dashboard' },
        { name: 'Attachés', to: '/admin/attaches' },
        {
            name: 'Logout', onClick: (e: React.SyntheticEvent) => {
                e.preventDefault();
                e.stopPropagation();
                Auth.logout();
            }
        }
    ];

    useEffect(() => {
        setIsAuthenticated(Auth.loggedIn());

        setIsOpen(!isMobile);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (isMounted) {
            setIsOpen(!isMobile);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMobile]);

    useEffect(() => {
        if (isMounted) {
            if (typeof window !== 'undefined' && isMounted) {

                window.addEventListener('keydown', controlAltL);
            }
            setIsAuthenticated(Auth.loggedIn());
        }
        return () => {
            if (typeof window !== 'undefined' && isMounted) {
                window.removeEventListener('keydown', controlAltL);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMounted]);

    if (!isMounted) {
        return null;
    }

    const linksToRender = isAuthenticated ? adminLinks : links;
    return (
        <header className={componentStyles.header + componentStyles.headerResponsive}>
            {
                isOpen ? (
                    <>
                        <Link href={'/'}>
                            <h1 className={componentStyles.name}>{navHeading}</h1>
                        </Link>
                        <nav className={componentStyles.navBar + componentStyles.navBarResponsive}>
                            {
                                linksToRender.map(el => <NavLink linkName={el.name} to={el.to} key={el.name} onClick={el.onClick} />)
                            }
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
