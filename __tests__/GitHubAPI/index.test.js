import GitHubAPI from '../../lib/GitHubAPI';

const covidMaster = 'covid-master';


describe('GitHubAPI', () => {
    it('Instantiates a new GitHubAPI Class', () => {

        expect(GitHubAPI).toBeInstanceOf(GitHubAPI);
    });

    it('Has a public user property to expose the GitHub username', () => {

        expect(GitHubAPI.user).toBeDefined();
        expect(GitHubAPI.user).toBe(process.env.NEXT_PUBLIC_GIT_HUB_USERNAME);
    });

    it('Has a private variable that stays hidden', () => {

        expect(GitHubAPI['#auth']).toBeUndefined();
    });



    it('Can connect to my GitHub and retrieve my pinned repo names', async () => {

        const myPinned = [
            covidMaster,
            'dashboard',
            'employee-tracker',
            'budget-tracker',
            'rusty_wizard',
            'Flashtastic'
        ];


        const repos = await GitHubAPI.getPinnedRepoNames();

        expect(repos.ok).toBeTruthy();
        expect(repos.status).toEqual(200);
        expect(repos.data).toEqual(myPinned);
        expect(repos.errors).toBeUndefined();
    });

    it('Can connect to GitHub and retrieve a list of all repo names', async () => {

        const repos = await GitHubAPI.getAllRepoNames();

        expect(repos.ok).toBeTruthy();
        expect(repos.status).toEqual(200);
        expect(repos.errors).toBeUndefined();
    });

    it('Can connect to GitHub and retrieve a repo by name', async () => {

        const repo = await GitHubAPI.getRepoByName(covidMaster);

        const expectedData = {
            data: {
                name: covidMaster,
                size: 35469,
                demoUrl: '',
                liveUrl: 'https://iiTONELOC.github.io/covid-master',
                screenshotUrl: 'https://raw.githubusercontent.com/iiTONELOC/covid-master/main/assets/images/screenshot.jpeg',
                repoUrl: 'https://github.com/iiTONELOC/covid-master',
                license: 'MIT License',
                description: 'Bored in the House is an interactive web application that presents meal recipes, drink recipes, and movies based on user input. ',
                topLanguage: 'JavaScript',
                createdAt: '2021-02-02T03:35:50Z',
                updatedAt: '2022-10-10T20:20:59Z',
                openIssues: 0,
                cloneUrl: 'https://github.com/iiTONELOC/covid-master.git'
            },
            status: 200,
            ok: true,
            errors: []
        };

        if (repo) {
            expect(repo).toEqual(expectedData);
        }
    });

    it('Can connect to GitHub and retrieve a repository\'s contents', async () => {
        const covidMasterContents = await GitHubAPI.getRepoContents(covidMaster);

        expect(covidMasterContents.data).toBeDefined();
    });

    it('Can connect to GitHub and retrieve a repository\'s readme', async () => {
        const expectedData = {
            html_url: 'https://github.com/iiTONELOC/covid-master/blob/main/README.md',
            download_url: 'https://raw.githubusercontent.com/iiTONELOC/covid-master/main/README.md'
        };

        const covidMasterReadmeData = await GitHubAPI.getRepoReadme(covidMaster);

        expect(covidMasterReadmeData.data).toEqual(expectedData);
    });

    it('Can connect to GitHub and retrieve the screenshot url from the readme', async () => {
        const expectedData = {
            data: {
                screenshotUrl: 'https://raw.githubusercontent.com/iiTONELOC/covid-master/main/assets/images/screenshot.jpeg'
            },
            status: 200,
            ok: true,
            errors: []
        };

        const covidMasterReadmeScreenshot = await GitHubAPI.getRepoScreenshot(covidMaster);

        expect(covidMasterReadmeScreenshot).toBeDefined();
        expect(covidMasterReadmeScreenshot).toEqual(expectedData);
    });

    it('Can return the URL for my GitHub Avatar', async () => {
        const avatar = await GitHubAPI.getAvatarURL();

        expect(avatar).toBeDefined();
        expect(avatar.data.avatar_url).
            toEqual('https://avatars.githubusercontent.com/u/75545909?v=4');
    });

    it('Can return the link to the demo video from the README', async () => {
        const expectedData = {
            data: {
                demoUrl: 'https://drive.google.com/file/d/1_rLpuJNYqfKFYjpfh1-PHcIBcDm9GDr8/view'
            },
            status: 200,
            ok: true,
            errors: []
        };

        const demoURL = await GitHubAPI.getDemoURL('employee-tracker');

        expect(demoURL).toBeDefined();
        expect(demoURL).toEqual(expectedData);
    });

    it('Can return the live URL link for the repo from the JSON settings', async () => {
        const expectedData = 'https://i-dash.herokuapp.com/';
        const liveUrl = await GitHubAPI.getLiveURLForPinned('dashboard', 'pinned');
        const { data } = liveUrl;

        expect(liveUrl).toBeDefined();
        expect(data.liveUrl).toEqual(expectedData);
    });
});
