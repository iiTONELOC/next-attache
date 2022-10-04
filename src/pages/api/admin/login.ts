import { UserController } from '../../../../lib/db/controller';
import type { NextApiRequest, NextApiResponse } from 'next';
import { authenticationResponseData } from '../../../types';
import { signToken } from '../../../utils/withAdminAuth';
import HttpStatus from '../../../utils/StatusCodes';
import withAppAuth from '../../../utils/withAppAuth';

const { lookUpUserBy } = UserController;

// /api/admin/login
export default async function handler(
    req: NextApiRequest, res: NextApiResponse
): Promise<authenticationResponseData> {

    return withAppAuth(req, res,
        async () => {
            const { name, password } = req.body;

            if (name && password) {
                // look up the user
                const user = await lookUpUserBy.name(name);// NOSONAR

                if (user) {
                    // verify the password
                    /*@ts-ignore*/
                    if (await user.isCorrectPassword(password)) {
                        // sign a token with the user data
                        // FIXME: Encrypt the _id

                        const token = signToken({ name, password, _id: user._id });

                        return res.status(HttpStatus.OK).json({ data: { token } });
                    } else {
                        return res.status(HttpStatus.BAD_REQUEST).json(
                            { error: { message: 'Incorrect credentials' } });
                    }
                } else {
                    return res.status(HttpStatus.UNAUTHORIZED).json(
                        { error: { message: 'Unauthorized' } });
                }
            } else {
                return res.status(HttpStatus.UNAUTHORIZED).json(
                    { error: { message: 'Unauthorized' } });
            }
        }
    );
}
