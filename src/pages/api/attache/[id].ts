import { AttacheController } from '../../../../lib/db/controller';
import { dbConnection } from '../../../../lib/db/connection';
import type { NextApiRequest, NextApiResponse } from 'next';
import withAdminAuth from '../../../utils/withAdminAuth';
import HttpStatus from '../../../utils/StatusCodes';

dbConnection();
const { getAttacheById } = AttacheController;


// api/attache
export default function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { method } = req;

    return withAdminAuth(req, res, async () => {
        try {

            switch (method) { //NOSONAR
                case 'GET':
                    const { id } = req.query;
                    const attache = await getAttacheById(id as string);
                    return res.status(HttpStatus.OK).json(attache);
                default:
                    return res.status(HttpStatus.METHOD_NOT_ALLOWED).json({
                        error: `Method ${method} not allowed`
                    });
            }

        } catch (error: any) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                error: error?.message || 'Something went wrong'
            });
        }
    });
}
