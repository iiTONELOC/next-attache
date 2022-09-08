it('Creates the GitHubAPI\'s JSON data', () => {
    const { readFileSync, existsSync } = require('fs');
    const { fork } = require('child_process');

    const expectedData = {
        "username": "GitHubUsername",
        "authentication": "GitHubAccessToken"
    };

    // only recreate the test data if the test file does not exist
    if (!existsSync('.github.config-test.json')) {
        // create the JSON file
        fork('scripts/createGitHubJSON.mjs',
            ['GitHubUsername', 'GitHubAccessToken'],
            { env: { ...process.env, NODE_ENV: 'test' } });
    }

    // read the file
    const data = readFileSync('.github.config-test.json');

    //check if the data is correct
    expect(JSON.parse(data)).toEqual(expectedData);
});
