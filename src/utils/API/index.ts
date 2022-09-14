
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

    async getRepo(repoName: string) {

        const response = await fetch(`/api/repo/${repoName}`, {
            method: 'GET',
            headers: this.#headers
        });

        const data = await response.json();
        return data;
    }
}

export default new API();
