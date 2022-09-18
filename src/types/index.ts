// this file contains client side types
import type { adminLoginProps, adminSignUpProps } from '../utils/API/types';
import type { repoByName } from '../../lib/GitHubAPI/types';
import type { IconProps } from '../components/Icons/types';


// client side API
export type repoData = repoByName & {
    screenshotURL?: string,
    liveURL?: string,
    demoURL?: string,
    token?: string,
};

// API Responses
export type apiResponseData = {
    data?: repoData,
    error?: { message: string }
};



// pages or components
export type isMountedType = boolean | null;
export type apiDataType = repoData | null;
export type errorType = string | null;
export type { IconProps, adminLoginProps, adminSignUpProps };

