import { readFileSync } from 'fs';
import fetch from 'node-fetch'; //NOSONAR

import { headers } from './helpers';

import { APIResponseData } from './interfaces';
import { repoByName } from './types';


const filename: string = process.env.NODE_ENV === 'test' ?
    './.github.config-test.json' : './.github.config.json';

const creationErrorPrefix = 'GitHubAPI Creation error:';

const graphqlEndPoint = 'graphql';
const restRepoEndPoint = (owner: string, repo: string): string => `repos/${owner}/${repo}`;

const gitHubAPIUrl = 'https://api.github.com/';
const graphQLRequestURL = gitHubAPIUrl + graphqlEndPoint;

export default class GitHubAPI {
    user: string;
    #auth: string;

    constructor() {
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
            const URL = gitHubAPIUrl + restRepoEndPoint(this.user, 'covid-master');
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
                data: [],
                status: 500,
                ok: false,
                errors: [error]
            };
        }
    }
}
