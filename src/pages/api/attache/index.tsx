import type { NextApiRequest, NextApiResponse } from 'next';
import withAdminAuth from '../../../utils/withAdminAuth';
import HttpStatus from '../../../utils/StatusCodes';


const createAttache = async (req: NextApiRequest, res: NextApiResponse) => {
    const data = {
        data: {
            message: 'Testing, route works'
        }
    };

    return res.status(200).json({ ...data });
};


// api/attache
export default function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { query, method } = req;
    console.log("ATTACHE ROUTE HIT");
    console.log({ query, method });

    return withAdminAuth(req, res, async () => {
        try {
            // WILL BE ADDING MORE ROUTES HERE
            // A SWITCH STATEMENT SHOULD HAVE AT
            // LEAST 3 CASES
            switch (method) { //NOSONAR
                case 'POST':
                    return createAttache(req, res);
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
