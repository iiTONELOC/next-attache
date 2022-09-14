import gitHubDefaults from '../../.github.config.json';
import type { NextApiRequest, NextApiResponse } from 'next';

/**
 *  Authentication middleware for Next.js API routes
 * Requires a GitHub token to be passed in the request header, this token is then compared to the token in the .github.config.json file
 * @param req NextApiRequest
 * @param res NextApiResponse
 * @param callback Function to execute if the request is authenticated
 */
export default function withAuth(req: NextApiRequest, res: NextApiResponse, callback: Function) {
    const { headers } = req;
    const { authorization } = headers;
    const { authenticate } = gitHubDefaults;
    const extractToken = (auth: string) => auth.split(' ')[1] || '';

    if (authorization && extractToken(authorization) === authenticate) {
        return callback();
    } else {
        return res.status(401).json({ error: { message: 'Unauthorized' } });
    }
}
