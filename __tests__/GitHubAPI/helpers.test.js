const { headers } = require('../../lib/GitHubAPI/helpers');

describe('GitHubAPI Helpers - headers function', () => {
    it('Returns the correct Authorization and Content-Type entries', () => {
        const expected = {
            'Authorization': 'bearer GitHubAccessToken',
            'Content-Type': 'application/json'
        };
        expect(headers('GitHubAccessToken')).toEqual(expected);
    });

    it('Assigns empty auth to the Authorization header if not provided', () => {
        const expected = {
            'Authorization': 'bearer ',
            'Content-Type': 'application/json'
        };
        expect(headers()).toEqual(expected);
    });
});
