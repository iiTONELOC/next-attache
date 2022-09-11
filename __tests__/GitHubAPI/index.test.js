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

    it('Can connect to my GitHub and retrieve my pinned repos', async () => {

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

            const repos = await gitHubAPI.getPinnedRepos();

            expect(repos.ok).toBeTruthy();
            expect(repos.status).toEqual(200);
            expect(repos.data).toEqual(myPinned);
            expect(repos.errors).toBeUndefined();
        }
        expect.assertions(4);
    });
});
