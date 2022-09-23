import { dbConnection } from '../../../../lib/db/connection';
import type { NextApiRequest, NextApiResponse } from 'next';
import withAdminAuth from '../../../utils/withAdminAuth';
import HttpStatus from '../../../utils/StatusCodes';
import { getRepo, findRepo } from './[name]';

dbConnection();

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { method, query } = req;

    return withAdminAuth(req, res, async () => {
        try {
            if (method === 'POST' && query?.liveUrlType === 'dynamic') {
                const existingRepo = await findRepo(req);
                if (existingRepo) {
                    //TODO: update the repo
                    //FIXME: update the repo
                    // WE NEED TO UPDATE THE EXISTING REPO
                    return res.status(HttpStatus.OK).json({ data: existingRepo });
                } else {
                    // get repo will locate it in the db or fetch it from GitHub
                    return getRepo(req, res);
                }
            }
        } catch (error) {
            console.error(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error });
        }
    });
}
