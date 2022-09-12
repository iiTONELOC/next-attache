it('Creates the GitHubAPI\'s JSON data', () => {
    const { readFileSync } = require('fs');
    const { fork } = require('child_process');

    const expectedData = {
        "username": "GitHubUsername", //NOSONAR
        "authenticate": "GitHubAccessToken"//NOSONAR
    };

    // the script is configured to rewrite the test file if it exists
    // and we are in a test environment
    fork('scripts/createGitHubJson.mjs',
        ['GitHubUsername', 'GitHubAccessToken'],
        { env: { ...process.env, NODE_ENV: 'test' } }
    );

    // read the file
    const data = readFileSync('.github.config-test.json');

    //check if the data is correct
    expect(JSON.parse(data)).toEqual(expectedData);
});
