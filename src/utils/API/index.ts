import { apiResponseData } from '../../types';
import { _query } from './helpers';

export const API_PREFIX = '/api';
export const ADMIN_PREFIX = '/admin';

class API {
    private readonly token: string;
    private readonly headers: Headers;


    constructor() {
        this.token = process.env.NEXT_PUBLIC_GIT_HUB_ACCESS_TOKEN || '';
        this.headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
        });
    }

    async getRepo(repoName: string, dynamic = false): Promise<apiResponseData> {
        const endpoint = dynamic ? `repo/${repoName}?liveUrlType=dynamic` : `repo/${repoName}`;
        return _query(endpoint, this.headers, API_PREFIX);
    }


    async getRepoNames() {
        return _query(`repo/names`, this.headers, API_PREFIX);
    }


    async getAvatar() {
        return _query(`avatar`, this.headers, API_PREFIX);
    }
}

export default new API();
