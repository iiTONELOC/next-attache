import fs from 'fs';

// Asynchronous file writing and reading is best practice to avoid blocking the event loop
// We want to block the event loop to ensure the file is written before continuing

// This file is used to generate the ignored JSON file necessary for the
// GitHubAPI to work properly. This file will only generate the JSON file if
// we are not in a production environment.

const green = '\x1b[32m%s\x1b[0m';
const yellow = '\x1b[33m%s\x1b[0m';

const args = process.argv.slice(2);

const filename = '.github.config.json';
const testFilename = '.github.config-test.json';

const username = args[0] || 'GitHubUsername';
const accessToken = args[1] || 'GitHubAccessToken';

const jsonLiteral = `{\n\t"username":"${username}",\n\t"authenticate":"${accessToken}"\n}`;

if (process.env.NODE_ENV !== 'production') {
    // check if the file exists
    if (!fs.existsSync(filename)) {

        // yellow text
        console.log(yellow, 'Creating GitHubAPI Config file...');

        // create the file
        fs.writeFileSync(filename, jsonLiteral);

        // green text
        console.log(green, '\tFile created successfully!');
    }

    if (process.env.NODE_ENV === 'test') {
        // create a test json file
        // delete the existing one to ensure we have a fresh one
        if (fs.existsSync(testFilename)) {
            fs.rmSync(testFilename);
        }
        fs.writeFileSync(testFilename, jsonLiteral);
    }
}

process.exit(0);
