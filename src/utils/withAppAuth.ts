import gitHubDefaults from '../../.github.config.json';
import type { NextApiRequest, NextApiResponse } from 'next';


/**
 *  Checks the authorization header for a valid token.
 * @param auth Authorization header
 * @returns The token if valid, otherwise an empty string.
 */
export const extractToken: Function = (auth: string): string => auth.split(' ')[1] || '';


/**
 *  Authentication middleware for Next.js API routes
 * Requires a GitHub token to be passed in the request header, this token is then compared to the token in the .github.config.json file
 * @param req NextApiRequest
 * @param res NextApiResponse
 * @param callback Function to execute if the request is authenticated
 */
export default function withAppAuth(req: NextApiRequest, res: NextApiResponse, callback: Function) {
    const { headers } = req;
    const { authorization } = headers;
    const { authenticate } = gitHubDefaults;


    if (authorization && extractToken(authorization) === authenticate) {
        return callback();
    } else {
        return res.status(401).json({ error: { message: 'Unauthorized' } });
    }
}
