import fs from 'fs';

// Asynchronous file writing and reading is best practice to avoid blocking the event loop
// We want to block the event loop to ensure the file is written before continuing

// This file is used to generate the ignored JSON file necessary for the
// GitHubAPI to work properly. This file will only generate the JSON file if
// we are not in a production environment.

const args = process.argv.slice(2);

const filename = '.github.config.json';
const testFilename = '.github.config-test.json';

const username = args[0] || 'GitHubUsername';
const accessToken = args[1] || 'GitHubAccessToken';

const jsonLiteral = `{\n\t"username":"${username}",\n\t"authenticate":"${accessToken}"\n}`;

/**
 * Writes the JSON file to the root directory of the project
 * @param {string} filename - The name of the file to create
 * @param {string} jsonLiteral - The JSON literal to write to the file
 */
const writeJson = (filename, jsonLiteral) => {
    try {
        fs.writeFileSync(filename, jsonLiteral);
    } catch (error) {
        console.trace(error);
    }
};

// Only allows for the script to run in a non-production environment
if (process.env.NODE_ENV !== 'production') {
    // check if the file exists
    if (!fs.existsSync(filename)) {
        writeJson(filename, jsonLiteral);
    }

    // if we are in test create the test file
    if (process.env.NODE_ENV === 'test') {
        // delete the existing to ensure we have a fresh file

        /*
        Some test functions may need to overwrite the test file
        because it contains non-functional data. When testing the
        actual API calls, the file will have to be overwritten with
        valid user credentials.
        */

        if (fs.existsSync(testFilename)) {
            fs.rmSync(testFilename);
        }

        writeJson(testFilename, jsonLiteral);
    }
}

process.exit(0);
