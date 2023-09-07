import fs from 'fs';

// Asynchronous file writing and reading is best practice to avoid blocking the event loop
// We want to block the event loop to ensure the file is written before continuing

// This file is used to generate the ignored JSON file necessary for the
// GitHubAPI to work properly. This file will only generate the JSON file if
// we are not in a production environment.

const args = process.argv.slice(2); // NOSONAR

const [username, accessToken] = args;

const filename = '.env.local';
const testFilename = '.env.test';

const nextPublic = 'NEXT_PUBLIC';
const usrPrefix = nextPublic + '_GIT_HUB_USERNAME';
const tokenPrefix = nextPublic + '_GIT_HUB_ACCESS_TOKEN';

const envLiteral = `${usrPrefix} = ${username}\n${tokenPrefix} = ${accessToken}\n`;

const otherEnvs = {
    JWT_EXP: 'Length of time for JWT to expire refer to the docs for more info: https://www.npmjs.com/package/jsonwebtoken',
    JWT_SECRET: 'Secret used to sign the JWT, this should a randomized 32 bit (or character) string, for best results with Next.js don\'t use $ in the envs',
    SALT_ROUNDS: 'The number of rounds to use for the bcrypt hashing algorithm, refer to the docs for more info: https://www.npmjs.com/package/bcrypt',
    NEXT_PUBLIC_EMAIL_PUB_TOKEN: 'The public token for the Email.js service used to send emails. For more info: https://www.emailjs.com/docs/rest-api/send-form/',
    NEXT_PUBLIC_CAPTCHA_SITE_KEY: 'Email.js was paired with captcha to prevent spam. For more info: https://www.emailjs.com/docs/user-guide/adding-captcha-verification',
    NEXT_PUBLIC_EMAIL_SERVICE_ID: 'The service ID for the Email.js service used to send emails. For more info: https://www.emailjs.com/docs/user-guide/connecting-email-services/',
    NEXT_PUBLIC_EMAIL_TEMPLATE_ID: 'The template ID for the Email.js service used to send emails. For more info: https://www.emailjs.com/docs/user-guide/creating-email-templates/',
};


/**
 * Writes a string to a file
 * @param {string} filename - The name of the file to create
 * @param {string} jsonLiteral - The JSON literal to write to the file
 */
const writeStringToFile = (filename, _string) => {
    try {
        fs.writeFileSync(filename, _string);
    } catch (error) {
        console.trace(error);
    }
};


const validUser = username && username.length > 0 && username !== '<username>';
const validToken = accessToken && accessToken.length > 0 && accessToken !== '<token>';

// only write to the file if it does not exist
if (process.env.NODE_ENV !== 'production'
    && validUser
    && validToken) {
    if (!fs.existsSync(filename)) {
        // mutable string
        let newLiteral = envLiteral + '\n\n';

        // add the other envs to the string
        for (const [key, value] of Object.entries(otherEnvs)) {
            newLiteral += `${key} = <${value}>\n`;
        }

        writeStringToFile(filename, newLiteral);
    }

    // creates a .env.test file for testing purposes
    if (!fs.existsSync(testFilename)) {
        writeStringToFile(testFilename, envLiteral);
    }
}


process.exit(0);
