import {
    writeEnvDataToTestJson, resetTestJson, emptyTestJson,
    writeUsernameTestJson, writeAuthTestJson
} from '../../lib/utils';

import GitHubAPI from '../../lib/GitHubAPI';
const covidMaster = 'covid-master';

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

    it('Notifies a user that a GitHub username and auth token are required', async () => {

        // delete the test.json file
        const didDelete = await emptyTestJson();

        if (didDelete) {
            // reset the test.json file
            try {
                const gitHubAPI = new GitHubAPI();
                expect(gitHubAPI).toBeInstanceOf(GitHubAPI);
            } catch (error) {
                expect(error.message).toBe('GitHubAPI Creation error: A username and auth token are required');
            }
        }
        expect(didDelete).toBe(true);

        await resetTestJson();
        expect.assertions(2);
    });

    it('Notifies a user that a GitHub auth token is required', async () => {
        const didDelete = await writeUsernameTestJson();

        if (didDelete) {
            // reset the test.json file
            try {
                const gitHubAPI = new GitHubAPI();
                expect(gitHubAPI).toBeInstanceOf(GitHubAPI);
            } catch (error) {
                expect(error.message).toBe('GitHubAPI Creation error: An auth token is required');
            }
        }
        expect(didDelete).toBe(true);

        await resetTestJson();
        expect.assertions(2);
    });

    it('Notifies a user that a GitHub username is required', async () => {
        const didDelete = await writeAuthTestJson();

        if (didDelete) {
            // reset the test.json file
            try {
                const gitHubAPI = new GitHubAPI();
                expect(gitHubAPI).toBeInstanceOf(GitHubAPI);
            } catch (error) {
                expect(error.message).toBe('GitHubAPI Creation error: A username is required');
            }
        }
        expect(didDelete).toBe(true);

        await resetTestJson();
        expect.assertions(2);
    });

    it('Can connect to my GitHub and retrieve my pinned repo names', async () => {

        // we need to read our login info from the .env file
        // and write it to the test.json file so that we can
        // actually make an API call to GitHub
        const newCredentials = await writeEnvDataToTestJson();

        // list of my pinned repos to test against
        const myPinned = [
            covidMaster,
            'dashboard',
            'employee-tracker',
            'budget-tracker',
            'rusty_wizard',
            'Flashtastic'
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

            const repo = await gitHubAPI.getRepoByName(covidMaster);

            const expectedData = {
                data: {
                    name: covidMaster,
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
            };

            if (repo) {
                expect(repo).toEqual(expectedData);
            }
        }
        expect.assertions(1);
    });

    it('Can connect to GitHub and retrieve a repository\'s contents', async () => {
        const newCredentials = await writeEnvDataToTestJson();

        if (newCredentials) {
            const gitHubAPI = new GitHubAPI();
            resetTestJson();
            const covidMasterContents = await gitHubAPI.getRepoContents(covidMaster);

            expect(covidMasterContents.data).toBeDefined();
        }
        expect.assertions(1);
    });

    it('Can connect to GitHub and retrieve a repository\'s readme', async () => {
        const newCredentials = await writeEnvDataToTestJson();
        const expectedData = {
            html_url: 'https://github.com/iiTONELOC/covid-master/blob/main/README.md',
            download_url: 'https://raw.githubusercontent.com/iiTONELOC/covid-master/main/README.md'
        };
        if (newCredentials) {
            const gitHubAPI = new GitHubAPI();
            resetTestJson();

            const covidMasterReadmeData = await gitHubAPI.getRepoReadme(covidMaster);
            expect(covidMasterReadmeData.data).toEqual(expectedData);
        }
        expect.assertions(1);
    });

    it('Can connect to GitHub and retrieve the screenshot url from the readme', async () => {
        const newCredentials = await writeEnvDataToTestJson();

        const expectedData = {
            data: {
                screenshotURL: 'https://raw.githubusercontent.com/iiTONELOC/covid-master/main/assets/images/boredinthehousegif.gif'
            },
            status: 200,
            ok: true,
            errors: []
        };

        if (newCredentials) {
            const gitHubAPI = new GitHubAPI();
            resetTestJson();

            const covidMasterReadmeScreenshot = await gitHubAPI.getRepoScreenshot(covidMaster);
            expect(covidMasterReadmeScreenshot).toBeDefined();
            expect(covidMasterReadmeScreenshot).toEqual(expectedData);
        }
        expect.assertions(2);
    });

    it('Can return the URL for my GitHub Avatar', async () => {
        const newCredentials = await writeEnvDataToTestJson();

        if (newCredentials) {
            const gitHubAPI = new GitHubAPI();
            resetTestJson();

            const avatar = await gitHubAPI.getAvatarURL();

            expect(avatar).toBeDefined();
            expect(avatar.data.avatar_url).toEqual('https://avatars.githubusercontent.com/u/75545909?v=4');
        }
        expect.assertions(2);
    });

    it('Can return the link to the demo video from the README', async () => {
        const newCredentials = await writeEnvDataToTestJson();

        const expectedData = {
            data: {
                demoURL: 'https://drive.google.com/file/d/1_rLpuJNYqfKFYjpfh1-PHcIBcDm9GDr8/view'
            },
            status: 200,
            ok: true,
            errors: []
        };

        if (newCredentials) {
            const gitHubAPI = new GitHubAPI();
            resetTestJson();

            const demoURL = await gitHubAPI.getDemoURL('employee-tracker');

            expect(demoURL).toBeDefined();
            expect(demoURL).toEqual(expectedData);
        }
    });

    it('Can return the live URL link for the repo from the JSON settings', async () => {
        const newCredentials = await writeEnvDataToTestJson();

        const expectedData = 'https://i-dash.herokuapp.com/';

        if (newCredentials) {
            const gitHubAPI = new GitHubAPI();
            resetTestJson();

            const liveURL = await gitHubAPI.getLiveURL('dashboard');

            expect(liveURL).toBeDefined();
            expect(liveURL).toEqual(expectedData);
        }
    })
});
