const { restRepoEndPoint } = require('../../lib/GitHubAPI/constants');

describe('GitHubAPI Constants file', () => {

    it('Has a restRepoEndPoint function that returns a relative url', () => {
        const repo = 'repo';
        const owner = 'owner';
        const expected = 'repos/owner/repo';
        const actual = restRepoEndPoint(owner, repo);

        expect(actual).toBe(expected);
    });
});
