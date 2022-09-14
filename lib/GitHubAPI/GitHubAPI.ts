import { readFileSync } from 'fs';
import fetch from 'node-fetch'; //NOSONAR
import { headers } from './helpers';
import { repoByName } from './types';
import { APIResponseData } from './interfaces';
import repoDefaults from '../../attache-defaults.json';
import {
    filename, creationErrorPrefix, restRepoEndPoint,
    gitHubAPIUrl, graphQLRequestURL
} from './constants';



export default class GitHubAPI {
    user: string;
    #auth: string;

    constructor() {
        // istanbul ignore next
        const config = JSON.parse(readFileSync(filename, 'utf8') || '{}');
        const { username, authenticate } = config;

        if (!username && authenticate) {
            throw new Error(creationErrorPrefix + ' A username is required');
        }

        if (!authenticate && username) {
            throw new Error(creationErrorPrefix + ' An auth token is required');
        }

        if (!authenticate && !username) {
            throw new Error(creationErrorPrefix + ' A username and auth token are required');
        }

        this.user = username;
        this.#auth = authenticate;
    }

    /**
     * Retrieve the user's repositories
     * returns an object with the following properties:
     * ```js
     * {
     *   data: [], // array of strings containing repo names
     *   errors: [], // array of graphql error objects
     *   ok: boolean, // true if the request was successful
     *   status: number // the status code of the response
     * }
     * ```
     */
    async getPinnedRepoNames(): Promise<APIResponseData> {
        try {
            // Have to use the GraphQL API over the REST API to get the pinned repos
            const query = `query{user(login:"${this.user}"){
                pinnedItems(first: 6, types: REPOSITORY){nodes{...on Repository{name}}}
            }}`;

            const graphRes = await fetch(graphQLRequestURL, {
                method: 'POST',
                headers: headers(this.#auth),
                body: JSON.stringify({ query })
            });

            const graphData = await graphRes.json();
            const { data, errors } = graphData;

            return {
                data: data?.user?.pinnedItems?.nodes?.map(
                    (node: { name?: string; }) => node?.name) || [],
                status: graphRes.status,
                ok: graphRes.ok,
                errors
            };
        } catch (error) {
            return {
                data: [],
                status: 500,
                ok: false,
                errors: [error]
            };
        }
    }

    /**
     * Get information about a repo by name
     * @param repoName the name of the repo to look up
     * @returns
     * ```js
     * {
            data: {
                name: // the name of the repo,
                size: // the size of the repo in bytes,
                url: // the url of the repo,
                license: // the license of the repo,
                description: // the description of the repo,
                top_language: // the top language of the repo,
                created_at: // the date the repo was created,
                updated_at: // the date the repo was last updated,
                open_issues: // the number of open issues,
                clone_url: // the url to clone the repo,
            },
            status: res.status,
            ok: res.ok,
            errors: []
        }
    * ```
     */
    async getRepoByName(repoName: string): Promise<APIResponseData> {

        try {
            const URL = gitHubAPIUrl + restRepoEndPoint(this.user, repoName);
            /* istanbul ignore next */
            const res = await fetch(URL, {
                method: 'GET',
                headers: headers(this.#auth)
            });

            const data: repoByName = await res.json();

            return {
                data: {
                    name: data.name,
                    size: data.size,
                    url: data.html_url,
                    license: data.license?.name,
                    description: data.description,
                    top_language: data.language,
                    created_at: data.created_at,
                    updated_at: data.updated_at,
                    open_issues: data.open_issues,
                    clone_url: data.clone_url
                },
                status: res.status,
                ok: res.ok,
                errors: []
            };
        } catch (error) {
            return {
                data: {},
                status: 500,
                ok: false,
                errors: [error]
            };
        }
    }

    /**
     * Retrieves an array of objects containing the contents of the repository
     * @param repoName the name of the repo to look up
     */
    async getRepoContents(repoName: string): Promise<APIResponseData> {
        try {
            const URL = gitHubAPIUrl + restRepoEndPoint(this.user, repoName) + '/contents';
            /* istanbul ignore next */
            const res = await fetch(URL, {
                method: 'GET',
                headers: headers(this.#auth)
            });

            const data = await res.json();

            return {
                data,
                status: res.status,
                ok: res.ok,
                errors: []
            };
        } catch (error) {
            return {
                data: [],
                status: 500,
                ok: false,
                errors: [error]
            };
        }
    }

    /**
     * Retrieves the readme of a repository
     * @param repoName the name of the repo to look up
     * @returns
     * ```js
     * {
            data: {
                html_url: 'url',
                download_url: 'url'
            },
            status: res.status,
            ok: res.ok,
            errors: []
        }
    * ```
     */
    async getRepoReadme(repoName: string): Promise<APIResponseData> {
        try {
            const contents: APIResponseData = await this.getRepoContents(repoName);

            const readme = contents.data.
                find((file: { name: string; }) => file.name.includes('README'));

            return {
                data: {
                    html_url: readme?.html_url,
                    download_url: readme?.download_url
                },
                status: contents.status,
                ok: contents.ok,
                errors: contents.errors
            };
        } catch (error) {
            return {
                data: {},
                status: 500,
                ok: false,
                errors: [error]
            };
        }
    }

    /**
     * Retrieves the URL for the user's README
     * @param repoName the name of the repo to look up
     * @returns
     * ```js
     * {
            data: {screenshotURL: 'url'},
            status: res.status,
            ok: res.ok,
            errors: []
        }
    * ```
     */
    async getRepoScreenshot(repoName: string): Promise<APIResponseData> {
        try {
            const readme = await this.getRepoReadme(repoName);
            const screenShotRegex = /#.+Screenshot?.+\n+!\[.+\]\(.+\)/g;
            const downloadURL = readme.data.download_url.replace('README.md', '');

            if (readme.ok) {
                const readmeData = await fetch(readme.data.download_url);
                const readmeText = await readmeData.text();

                // capture the screenshot section of the readme
                const screenshotMatch = readmeText.match(screenShotRegex);

                // remove all extra spacing and newlines
                const screenshotRaw = screenshotMatch?.[0].replace(/\s+/g, '');

                // capture the relative path to the screenshot
                const scrnShotPath = screenshotRaw?.match(/\(.+\)/g)?.[0];

                // remove the parenthesis and the "./" from the path
                let screenshotURL = downloadURL + scrnShotPath?.replace('(', '')
                    .replace(')', '')
                    .replace('./', '');

                !screenshotMatch && (screenshotURL = 'https://via.placeholder.com/150');
                return {
                    data: { screenshotURL },
                    status: readme.status,
                    ok: readme.ok,
                    errors: readme.errors
                };
            } else {
                return {
                    data: {},
                    status: readme.status,
                    ok: readme.ok,
                    errors: readme.errors
                };
            }
        } catch (error) {
            return {
                data: {},
                status: 500,
                ok: false,
                errors: [error]
            };
        }
    }

    /**
    * Retrieves the URL for the user's Demo video
    * @param repoName the name of the repo to look up
    * @returns
    * ```js
    * {
            data: {demoURL: 'url'},
            status: res.status,
            ok: res.ok,
            errors: []
        }
   * ```
    */
    async getDemoURL(repoName: string): Promise<APIResponseData> {
        try {
            const readme = await this.getRepoReadme(repoName);
            const demoRegex = /#.+Demo?.+\n+!?\[.+\]\(.+\)/g;

            if (readme.ok) {
                const readmeData = await fetch(readme.data.download_url);
                const readmeText = await readmeData.text();

                // capture the demo section of the readme
                const demoMatch = readmeText.match(demoRegex);

                // remove all extra spacing and newlines
                const demoRaw = demoMatch?.[0].replace(/\s+/g, '') || '';

                // capture the relative path to the screenshot
                const demoPath = demoRaw?.match(/\(.+\)/g)?.[0] || '';

                // remove the parenthesis and the "./" from the path
                const demoURL = demoPath.replace('(', '').replace(')', '');

                return {
                    data: { demoURL },
                    status: readme.status,
                    ok: readme.ok,
                    errors: readme.errors
                };
            } else {
                return {
                    data: {},
                    status: readme.status,
                    ok: readme.ok,
                    errors: readme.errors
                };
            }
        } catch (error) {
            return {
                data: {},
                status: 500,
                ok: false,
                errors: [error]
            };
        }
    }

    /**
 * Retrieves the URL for the live deployment
 * @param repoName the name of the repo to look up
 * @returns
 * ```js
 * {
            data: {liveURL: 'url' | demoURL: 'url'},
            status: res.status,
            ok: res.ok,
            errors: []
        }
* ```
 */
    async getLiveURL(repoName: string): Promise<APIResponseData> {
        try {
            const { pinned, otherRepos } = Object.create(repoDefaults);

            const repo = pinned[repoName] || otherRepos[repoName] || null;

            if (repo) {
                const { liveUrl } = repo;
                const _data = { liveURL: {} };

                switch (liveUrl) {
                    case 'GITHUB':
                        _data.liveURL = `https://${this.user}.github.io/${repoName}`;
                        break;
                    case 'NONE':
                        _data.liveURL = '';
                        break;
                    case 'DEMO':
                        _data.liveURL = '';
                        break;
                    default:
                        _data.liveURL = liveUrl;
                }

                return {
                    data: _data,
                    status: 200,
                    ok: true,
                    errors: []
                };
            } else {
                throw new Error('Repo not found');
            }
        } catch (error) {
            return {
                data: {},
                status: 500,
                ok: false,
                errors: [error]
            };
        }
    }


    /**
    * Retrieves the URL for the user's Avatar
    * @returns
    * ```js
    * {
            data: {avatar_url: 'url'},
            status: res.status,
            ok: res.ok,
            errors: []
        }
   * ```
    */
    async getAvatarURL(): Promise<APIResponseData> {
        try {
            const URL = gitHubAPIUrl + 'users/' + this.user;
            /* istanbul ignore next */
            const res = await fetch(URL, {
                method: 'GET',
                headers: headers(this.#auth)
            });

            const data = await res.json();

            return {
                data: {
                    avatar_url: data.avatar_url
                },
                status: res.status,
                ok: res.ok,
                errors: []
            };
        } catch (error) {

            return {
                data: {},
                status: 500,
                ok: false,
                errors: [error]
            };
        }
    }
}
