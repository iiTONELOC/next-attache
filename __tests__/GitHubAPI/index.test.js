import { writeEnvDataToTestJson, resetTestJson } from '../../utils';
const GitHubAPI = require('../../GitHubAPI').default;

describe('GitHubAPI', () => {
    it('Instantiates a new GitHubAPI Class', () => {
        const gitHubAPI = new GitHubAPI();

        expect(gitHubAPI).toBeInstanceOf(GitHubAPI);
    });

    it('Has a public user property to expose the GitHub username', () => {
        const gitHubAPI = new GitHubAPI();

        expect(gitHubAPI.user).toBeDefined();
        expect(gitHubAPI.user).toBe('GitHubUsername');
    });

    it('Has a private variable that stays hidden', () => {
        const gitHubAPI = new GitHubAPI();

        expect(gitHubAPI['#auth']).toBeUndefined();
    });

    it('Can connect to my GitHub and retrieve my pinned repo names', async () => {

        // we need to read our login info from the .env file
        // and write it to the test.json file so that we can
        // actually make an API call to GitHub
        const newCredentials = await writeEnvDataToTestJson();

        // list of my pinned repos to test against
        const myPinned = [
            'covid-master',
            'dashboard',
            'employee-tracker',
            'budget-tracker',
            'tailstrap',
            'rusty_wizard'
        ];

        if (newCredentials) {
            const gitHubAPI = new GitHubAPI();
            // now that the class has been instantiated, we can
            // reset the test.json file to its original state
            resetTestJson();

            const repos = await gitHubAPI.getPinnedRepoNames();

            expect(repos.ok).toBeTruthy();
            expect(repos.status).toEqual(200);
            expect(repos.data).toEqual(myPinned);
            expect(repos.errors).toBeUndefined();
        }
        expect.assertions(4);
    });

    it('Can connect to GitHub and retrieve a repo by name', async () => {
        const newCredentials = await writeEnvDataToTestJson();

        if (newCredentials) {
            const gitHubAPI = new GitHubAPI();
            resetTestJson();

            const repo = await gitHubAPI.getRepoByName('covid-master');
            const expectedData = {
                data: {
                    name: 'covid-master',
                    size: 35637,
                    url: 'https://github.com/iiTONELOC/covid-master',
                    license: 'MIT License',
                    description: 'Bored in the House is an interactive web application that presents meal recipes, drink recipes, and movies based on user input. ',
                    top_language: 'JavaScript',
                    created_at: '2021-02-02T03:35:50Z',
                    updated_at: '2021-11-11T04:05:57Z',
                    open_issues: 0,
                    clone_url: 'https://github.com/iiTONELOC/covid-master.git'
                },
                status: 200,
                ok: true,
                errors: []
            }

            if (repo) {
                expect(repo).toEqual(expectedData);
            }
        }
        expect.assertions(1);
    });
});
