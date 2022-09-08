import fs from 'fs';
// This file is used to generate the ignored JSON file necessary for the
// GitHubAPI to work properly. This file will only generate the JSON file if
// we are not in a production environment.

if (process.env.NODE_ENV !== 'production') {
    const args = process.argv.slice(2);
    const username = args[0];
    const accessToken = args[1] || 'GitHubAccessToken';
    const jsonLiteral = `{\n\t"username":"${username}",\n\t"authentication":"${accessToken}"\n}\n`;

    // check if the file exists
    if (!fs.existsSync('.github.config.json')) {
        // yellow text
        console.log('\x1b[33m%s\x1b[0m', 'Creating .github.config.json file...');
        // create the file
        fs.writeFileSync('.github.config.json', jsonLiteral);
        // green text
        console.log('\x1b[32m%s\x1b[0m', '\tFile created successfully!');
    } else {
        if (process.env.NODE_ENV === 'test') {
            console.log("TEST ENV")
            // create a test.env file
            fs.writeFileSync('.github.config-test.json', jsonLiteral);
        }
    }
}
