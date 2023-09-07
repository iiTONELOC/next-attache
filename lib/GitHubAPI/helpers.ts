import { read } from 'fs';
import { authHeaders } from './types';

/* istanbul ignore next */
export function headers(_authToken = ''): authHeaders {
    return {
        'Authorization': `bearer ${_authToken}`,
        'Content-Type': 'application/json'
    };
}

// a README parser is needed to extract the demo and screenshot URLs from the README.md file
// currently this is in the GitHubAPI but this should be decoupled and the API can call the parser
// after retrieving the README from the repo.

export function readmeParser(get: 'screenshot' | 'demo', readme: string, log = false): string | undefined | null {
    const DEMO_REGEX = /#.+Demo?.+\n+!?\[.+\]\(.+\)/g;
    const SCREENSHOT_REGEX = /#+.+Screenshot?.+\n+!\[.+\]\(.+\)/g;


    const matchedContentArray = (get === 'demo' ? DEMO_REGEX : SCREENSHOT_REGEX).exec(readme.trim());
    let matchedContent = matchedContentArray ? matchedContentArray[0] : '';

    if ((matchedContent === '' || matchedContent === undefined) && get === 'screenshot') {
        // it is not finding the screenshot even though it is there and all the other readmes are
        // structured the same way and it captures those screenshots, since we list the screenshot first, lets
        // try a less complex regex to see if it can find it
        matchedContent = readme.match(/\(.+\)/g)?.[0] ?? '';
    }

    let url: string | undefined | null = null;

    if (matchedContent !== '') {
        // remove all extra spacing and newlines
        const cleanedContent = matchedContent
            .replace(/\s+/g, ' ')
            .trim();

        // extract the URL from the markdown
        const neededPath = cleanedContent.match(/\(.+\)/g)?.[0];
        // remove parentheses
        url = neededPath?.replace(/[()]/g, '');

        // if screenshot, remove the base path from the URL
        get === 'screenshot' && (url = url?.replace('./', ''));

    }

    return url?.trim();
}
