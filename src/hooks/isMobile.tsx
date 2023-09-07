import { useState, useEffect, Dispatch } from 'react';
import { checkMobile } from '../utils';

const mobileEventListener: Function = (setIsMobile: Dispatch<boolean>) => {
    window.addEventListener('resize', () => {
        setIsMobile(checkMobile());
    });
};

export type isMobileType = {
    isMobile: boolean;
};

/**
 * Returns boolean value for whether the viewport should be considered mobile
 *
 * @example
 * ```js
 * import { IsMobile } from './hooks'; // relative path to hooks folder
 *
 * const { isMobile } = IsMobile();
 * ```
 */
export default function IsMobile(): isMobileType {// NOSONAR
    const [isMobile, setIsMobile] = useState<boolean>(false);

    useEffect(() => {
        setIsMobile(checkMobile());
        mobileEventListener(setIsMobile);

        return () => {
            window.removeEventListener('resize', () => {
                setIsMobile(checkMobile());
            });
        };
    }, []);

    return { isMobile };
}
