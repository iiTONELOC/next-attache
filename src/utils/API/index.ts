import { apiResponseData } from '../../types';
import { adminLoginProps, adminSignUpProps } from './types';

class API {
    #username: string;
    #token: string;
    #headers: Headers;

    constructor() {
        this.#username = process.env.NEXT_PUBLIC_GITHUB_USERNAME || '';
        this.#token = process.env.NEXT_PUBLIC_GIT_HUB_ACCESS_TOKEN || '';
        this.#headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.#token}`
        });
    }

    async getRepo(repoName: string): Promise<apiResponseData> {

        const response = await fetch(`/api/repo/${repoName}`, {
            method: 'GET',
            headers: this.#headers
        });

        const data = await response.json();
        return data;
    }

    async adminLogin(user: adminLoginProps): Promise<apiResponseData> {
        const response = await fetch('/api/admin/login', {
            method: 'POST',
            headers: this.#headers,
            body: JSON.stringify({ ...user })
        });

        const data = await response.json();
        if (response.ok) {
            const { token } = data.data;

            // set the token in local storage
            localStorage.setItem('git_portfolio_token', token);

            // redirect to the dashboard
            window.location.replace('/admin/dashboard');
        }
        return data;
    }

    async adminSignUp(user: adminSignUpProps): Promise<apiResponseData> {
        const response = await fetch('/api/admin/sign-up', {
            method: 'POST',
            headers: this.#headers,
            body: JSON.stringify({ ...user })
        });

        const data = await response.json();
        if (response.ok) {
            const { token } = data.data;

            // set the token in local storage
            localStorage.setItem('git_portfolio_token', token);

            // redirect to the dashboard
            window.location.replace('/admin/dashboard');
        }
        return data;
    }

}

export default new API();
