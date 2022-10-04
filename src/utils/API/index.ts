import AuthService, { Auth } from '../Auth';
import { adminLoginProps, adminSignUpProps } from './types';
import { apiResponseData, authenticationResponseData } from '../../types';
import { AttacheState } from '../../components/Forms/CreateNewAttache/types';


const API_PREFIX = '/api';
const ADMIN_PREFIX = '/admin';

class API {
    #username: string;
    #token: string;
    #headers: Headers;
    #Auth: Auth;

    constructor() {
        this.#Auth = AuthService;
        this.#username = process.env.NEXT_PUBLIC_GITHUB_USERNAME || '';
        this.#token = process.env.NEXT_PUBLIC_GIT_HUB_ACCESS_TOKEN || '';
        this.#headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.#token}`
        });
    }

    private async _getFetch(endpoint: string, body?: object) {
        const routes = [API_PREFIX, endpoint];
        const response = await fetch(routes.join('/'), {
            method: 'GET',
            headers: this.#headers
        });

        const data = await response.json();
        return data;
    }

    private async _postFetch(endpoint: string, body: object) {
        const routes = [API_PREFIX, endpoint];
        const response = await fetch(routes.join('/'), {
            method: 'POST',
            headers: this.#headers,
            body: JSON.stringify({ ...body })
        });

        const data = await response.json();
        return data;
    }

    private async _adminPostFetch(endpoint: string, body: object) {
        const routes = [API_PREFIX, endpoint];

        const _headers = this.#headers;
        const token = this.#Auth.getToken();
        // remove the old authorization header
        _headers.delete('Authorization');
        // add the new authorization header
        _headers.append('Authorization', `Bearer ${token}`);

        const response = await fetch(routes.join('/'), {
            method: 'POST',
            headers: _headers,
            body: JSON.stringify({ ...body })
        });

        const data = await response.json();
        return data;
    }

    private async _adminLoginSignUp(user: adminLoginProps | adminSignUpProps,
        endpoint: string) {
        const routes = [ADMIN_PREFIX, endpoint];
        const data = await this._postFetch(routes.join('/'), user);

        if (data.ok) {
            const { token } = data.data;
            this.#Auth.login(token);
        }
        return data;
    }

    async getRepo(repoName: string): Promise<apiResponseData> {
        return this._getFetch(`repo/${repoName}`);
    }

    async getRepoNames() {
        return this._getFetch(`repo/names`);
    }

    async adminLogin(user: adminLoginProps): Promise<authenticationResponseData> {
        const data = await this._adminLoginSignUp(user, 'login');
        if (data.data.token) {
            this.#Auth.login(data.data.token);
        }
        return data;
    }

    async adminSignUp(user: adminSignUpProps): Promise<authenticationResponseData> {
        const data = await this._adminLoginSignUp(user, 'sign-up');
        if (data.data.token) {
            this.#Auth.login(data.data.token);
        }
        return data;
    }

    async createAttache(formData: AttacheState) {
        const projects = [];

        // create the project data for the attache
        // this creates a new entry in the db for the project
        // if exists, we will update existing data.
        for (const project of formData.projectData) {
            const currentProject = await this._adminPostFetch(
                `repo/${project.name}?liveUrlType=dynamic`,
                {}
            );

            // add the project to the array
            currentProject && !currentProject.error && projects.push(currentProject.data);
            currentProject.error && console.error(currentProject.error);
        }

        // create the attache
        const attacheData = await this._adminPostFetch(
            'attache',
            // the endpoint expects a body with the following structure
            /*
                body:{
                    projects: [project],
                    name: string,
                    resume?: string,
                    notes?: string,
                }
            */
            { projects, ...formData.details }
        );

        return attacheData;
    }


}

export default new API();
