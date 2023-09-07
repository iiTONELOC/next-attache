import type { NextApiRequest, NextApiResponse } from 'next';
import type { repoNameData } from '../../../types';
import HttpStatus from '../../../utils/StatusCodes';
import GitHubAPI from '../../../../lib/GitHubAPI';
import withAppAuth from '../../../utils/withAppAuth';

/**
 * Fetches the data for a single repo.
 */
export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<repoNameData>
) {
    return withAppAuth(req, res, async () => {
        try {

            const repo: {
                data: repoNameData['data'];
                status: number;
                ok: boolean;
                errors?: [{ message: string }];
            } = await GitHubAPI.getAllRepoNames();
            const data = repo.data;

            return res.status(repo.status).json({ data });
        } catch (error: any) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                error: error?.message || 'Something went wrong'
            });
        }
    });
}
