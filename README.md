# &#128278; Attaché

## &#128679; Coming Soon &#128679;

### &#128188;  *Portfolio and Resume Manager for Next.js*

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)

## Installation

## &#128736;

1. Clone the repository

    ```bash
    git clone https://github.com/iiTONELOC/next-attache.git
    ```

2. Create the JSON file for the GitHubAPI.
    1. replace `GitHubUsername` with your GitHub Username  

    2. Optional but recommend:  
       It is best to authenticate with the GitHub API since non-authenticated apps are rate-limited to 60 requests per hour. [Read more here](https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limiting).
       1. create a [GitHub access token to authenticate your app](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token).
       2. replace `GitHubAccessToken` with your newly created token.

        ```bash
            npm run create-github -u GitHubUsername -a GitHubAccessToken
        ```

## Usage

## &#128187;

- ### *`Development`*

    ```bash
    npm run dev
    ```

- ### *`Tests`*

    ```bash
    npm run test
    ```

- ### *`Lint`*

    ```bash
    npm run lint
    ``` 

- ### *`Build`*

    ```bash
    npm run build
    ```

- ### *`Start`*

    ```bash
    npm start
    ```


## LICENSE &#128190;

This project is licensed by the [MIT LICENSE](./LICENSE).
