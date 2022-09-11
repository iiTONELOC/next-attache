import { readFileSync } from 'fs';
import fetch from 'node-fetch'; //NOSONAR

const filename: string = process.env.NODE_ENV === 'test' ?
    './.github.config-test.json' : './.github.config.json';

const creationErrorPrefix = 'GitHubAPI Creation error:';

const graphqlEndPoint = 'graphql';
const gitHubAPIUrl = 'https://api.github.com/';
const graphQLRequestURL = gitHubAPIUrl + graphqlEndPoint;

type authHeaders = {
    'Authorization': string;
    'Content-Type': string;
};

interface APIResponseData {
    data: [] | [any],//NOSONAR
    errors: [] | [any],//NOSONAR
    ok: boolean,
    status: number
}

function headers(_authToken = ''): authHeaders {
    return {
        'Authorization': `bearer ${_authToken}`,
        'Content-Type': 'application/json'
    };
}

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
    async getPinnedRepos(): Promise<APIResponseData> {
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
}
