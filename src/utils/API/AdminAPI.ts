import { AttacheState } from '../../components/Forms/CreateNewAttache/types';
import { adminLoginProps, adminSignUpProps } from './types';
import { authenticationResponseData } from '../../types';
import { _mutate, _query } from './helpers';
import { ADMIN_PREFIX, API_PREFIX } from '.';
import AuthService, { Auth } from '../Auth';

const contentType = 'application/json';

class AdminAPI {
    private token: string;
    private headers: Headers;
    private Auth: Auth;

    constructor() {
        this.Auth = AuthService;
        this.token = this.Auth.getToken() || '';
        this.headers = new Headers({
            'Content-Type': contentType,
            'Authorization': `Bearer ${this.token}`
        });
    }

    private _updateAuth() {
        this.token = this.Auth.getToken() || '';
        this.headers = new Headers({
            'Content-Type': contentType,
            'Authorization': `Bearer ${this.token}`
        });
    }

    private async _loginSignUp(user: adminLoginProps | adminSignUpProps,
        endpoint: string) {
        // use our _mutate helper to make the request
        const data = await _mutate(
            endpoint,
            'POST',
            { ...user },
            this.headers,
            `${API_PREFIX}${ADMIN_PREFIX}`
        );

        if (data) {
            const token: string | undefined = data.token || data.data.token || undefined;

            if (token && typeof token === 'string') {
                this.Auth.login(token);
            }
        }

        return data;
    }

    async login(user: adminLoginProps): Promise<authenticationResponseData> {
        return this._loginSignUp(user, 'login');
    }

    async signUp(user: adminSignUpProps): Promise<authenticationResponseData> {
        return this._loginSignUp(user, 'sign-up');
    }

    async createAttache(formData: AttacheState) {
        const projects = [];

        this._updateAuth();

        // create the project data for the attache
        // this creates a new entry in the db for the project
        // if exists, we will update existing data.
        for (const project of formData.projectData) {
            // NON ADMIN AUTH TO HIT THE PROJECT/REPO API
            const headers = new Headers({
                'Content-Type': contentType,
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GIT_HUB_ACCESS_TOKEN}`
            });
            const currentProject = await _query(
                `repo/${project.name}?liveUrlType=dynamic`,
                headers,
                API_PREFIX
            );

            // add the project to the array
            currentProject && !currentProject.error && projects.push(currentProject.data);
            currentProject.error && console.error(currentProject.error);
        }

        return _mutate(
            'attache',
            'POST',
            {
                projects,
                ...formData.details
            },
            this.headers,
            API_PREFIX
        );
    }

    async getAttacheById(id: string) {
        return _query(`attache/${id}`, this.headers, API_PREFIX);
    }

}

export default new AdminAPI();
