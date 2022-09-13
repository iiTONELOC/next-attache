import Link from 'next/link';
import { useState, useEffect } from 'react';

const componentStyles = {
    link: ` w-full md:w-auto flex flex-row justify-center items-center bg-black text-gray-100
            p-3 rounded-md hover:bg-purple-900 hover:rounded:lg hover:cursor-pointer`,
    active: ` bg-purple-800`
};

export default function NavLink({ linkName, to = '/' }: { linkName: string, to: string }): JSX.Element | null {
    const isActive = (currentLink: string) => {
        const currentPath = window.location.pathname;
        return currentPath === currentLink;
    };
    const [isMounted, setIsMounted] = useState<null | boolean>(null);
    const [isActiveLink, setIsActiveLink] = useState<boolean>(isActive(to));


    useEffect(() => {
        setIsMounted(true);
        setIsActiveLink(isActive(to));
        return () => {
            setIsMounted(null);
            setIsActiveLink(false);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (isMounted) {
            setIsActiveLink(isActive(to));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [window.location.pathname]);

    if (!isMounted) {
        return null;
    }

    const activeStyle = isActiveLink ? componentStyles.active : '';
    return (
        <Link href={to}>
            <p className={componentStyles.link + '' + activeStyle}>{linkName}</p>
        </Link>
    );
}
