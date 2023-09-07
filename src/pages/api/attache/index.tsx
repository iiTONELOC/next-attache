import { AttacheController } from '../../../../lib/db/controller';
import { ProjectModel } from '../../../../lib/db/Models/Project'
import { dbConnection } from '../../../../lib/db/connection';
import type { NextApiRequest, NextApiResponse } from 'next';
import withAdminAuth from '../../../utils/withAdminAuth';
import HttpStatus from '../../../utils/StatusCodes';

dbConnection();
const { createAttache, getAttacheIds } = AttacheController;

const _createAttache = async (req: NextApiRequest, res: NextApiResponse) => {

    // required a name
    // and a resume, we haven't implemented that yet
    // can optionally take notes, and projects
    const { body } = req;
    const { projects, name, resume, notes } = body;

    const dateAndTime = new Date().toLocaleString();
    const _name = name || dateAndTime;
    const _resume = resume || 'no resume';

    const attacheData = {
        notes,
        name: _name,
        resume: _resume,
        projects: projects?.filter(
            (el: ProjectModel) => el !== undefined || el !== null) || []
    };

    const newAttache = await createAttache(attacheData);
    /*@ts-ignore*/
    return res.status(HttpStatus.CREATED).json({ ...newAttache._doc });
};

const _getAttacheIds = async (req: NextApiRequest, res: NextApiResponse) => {
    const ids = await getAttacheIds();
    if (ids) {
        return res.status(HttpStatus.OK).json(ids);
    } else {
        return res.status(HttpStatus.NOT_FOUND).json({ message: 'No ids found' });
    }
};

// api/attache
export default function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { method } = req;

    return withAdminAuth(req, res, async () => {
        try {
            // WILL BE ADDING MORE ROUTES HERE
            // A SWITCH STATEMENT SHOULD HAVE AT
            // LEAST 3 CASES
            switch (method) { //NOSONAR
                case 'POST':
                    return _createAttache(req, res);
                case 'GET':
                    return _getAttacheIds(req, res);
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
