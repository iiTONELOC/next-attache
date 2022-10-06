import { useState, useEffect, Dispatch } from 'react';
import { checkLandscape } from '../utils';

const landscapeEventListener: Function = (setIsLandScape: Dispatch<boolean>) => {
    window.addEventListener('resize', () => {
        setIsLandScape(checkLandscape());
    });
};

export type isLandscapeType = {
    isLandscape: boolean;
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
export default function IsLandscape(): isLandscapeType {// NOSONAR
    const [isLandscape, setIsLandscape] = useState<boolean>(false);

    useEffect(() => {
        setIsLandscape(checkLandscape());
        landscapeEventListener(setIsLandscape);

        return () => {
            window.removeEventListener('resize', () => {
                setIsLandscape(checkLandscape());
            });
        };
    }, []);

    return { isLandscape };
}
