// this file contains client side types
import type { repoByName } from '../../lib/GitHubAPI/types';
import type { IconProps } from '../components/Icons/types';

// client side API
export type repoData = repoByName & {
    screenshotURL?: string,
    liveURL?: string,
    demoURL?: string
};

export type apiResponseData = {
    data?: repoData,
    error?: string
};

// pages or components
export type isMountedType = boolean | null;
export type apiDataType = repoData | null;
export type errorType = string | null;
export type { IconProps };

