import Link from 'next/link';
import { useIsMounted } from '../../hooks';
import { useState, useEffect } from 'react';

const componentStyles = {
    link: ` w-full md:w-auto flex flex-row justify-center items-center bg-black text-gray-100
            p-3 rounded-md hover:bg-purple-900 hover:rounded:lg hover:cursor-pointer text-lg tracking-wide`,
    active: ` bg-purple-800 italic underline underline-offset-4`
};

export default function NavLink({ linkName, to, onClick }: //NOSONAR
    { linkName: string, to?: string, onClick?: Function }
): JSX.Element | null {
    const isActive = (currentLink: string) => {
        const currentPath = window.location.pathname;
        return currentPath === currentLink;
    };
    const [isActiveLink, setIsActiveLink] = useState<boolean>(to ? isActive(to) : false);
    const isMounted = useIsMounted();

    useEffect(() => {
        to && setIsActiveLink(isActive(to));
        return () => {
            setIsActiveLink(false);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (isMounted) {
            to && setIsActiveLink(isActive(to));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [window.location.pathname]);

    if (!isMounted) {
        return null;
    }

    const activeStyle = isActiveLink ? componentStyles.active : '';
    return (
        onClick === undefined ? (
            <Link href={to || ''}>
                <p className={componentStyles.link + '' + activeStyle}>
                    {linkName}
                </p>
            </Link>
        ) : (
            <p
                onClick={(e: React.SyntheticEvent) => onClick(e)}
                className={componentStyles.link + '' + activeStyle}
            >
                {linkName}
            </p>
        )
    );
}
