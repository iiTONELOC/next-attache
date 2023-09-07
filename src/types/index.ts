// this file contains client side types
import type { adminLoginProps, adminSignUpProps } from '../utils/API/types';
import type { repoByName } from '../../lib/GitHubAPI/types';
import type { IconProps } from '../components/Icons/types';


// client side API
export type repoData = repoByName & {
    screenshotUrl?: string | null,
    liveUrl?: string | null,
    demoUrl?: string | null,
};

export type repoNameData = {
    data?: string[],
    error?: { message: string }
};

// API Responses
export type apiResponseData = {
    data?: repoData,
    error?: { message: string }
};

export type authenticationResponseData = {
    data?: {
        token: string,
    },
    error?: { message: string }
};


// pages or components
export type isMountedType = boolean | null;
export type apiDataType = repoData | null;
export type errorType = string | null;
export type { IconProps, adminLoginProps, adminSignUpProps };

