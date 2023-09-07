# &#128278; Attaché

### &#128188; _Portfolio and Resume Manager for Next.js_

# Screenshot

![screenshot](./assets/screenshot.png)




## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [License](#license)

## Installation

## &#128736;

1. Clone the repository

   ```bash
   git clone https://github.com/iiTONELOC/next-attache.git
   ```

2. Install dependencies

   ```bash
   npm i
   ```


3. Create the configuration file for the GitHubAPI.

   1. Authentication is required:

      1. Create a [GitHub access token to authenticate your app](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token).

      2. Create a `.env.local` and `env.test` file, be sure to replace `username` and `auth` with your GitHub username and previously created auth token.

          ```bash
          npm run env <username> <auth>
          ```
      3. Create the missing envs that are listed in the `.env.local` file.  
          - The following token names were created by the `npm run env` script but their values will need to be updated; be sure to replace the enclosing `< >`s with your unique information. Refer to the previously created `.env.local` file for more information.
        
            - JWT_EXP
            - JWT_SECRET
            - SALT_ROUNDS
            - NEXT_PUBLIC_EMAIL_PUB_TOKEN
            - NEXT_PUBLIC_CAPTCHA_SITE_KEY
            - NEXT_PUBLIC_EMAIL_SERVICE_ID
            - NEXT_PUBLIC_EMAIL_TEMPLATE_ID


## Usage

## &#128187;

- ### _`Development`_

  ```bash
  npm run dev
  ```

- ### _`Tests`_

  ```bash
  npm run test
  ```

- ### _`Lint`_

  ```bash
  npm run lint
  ```

- ### _`Build`_

  ```bash
  npm run build
  ```

- ### _`Start`_

  - Ensure the build script has been run prior or use the _`development`_ script.

  ```bash
  npm start
  ```

## LICENSE

## &#128190;

This project is licensed by the [MIT LICENSE](./LICENSE).
