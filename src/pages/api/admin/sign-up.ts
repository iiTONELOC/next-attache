import gitHubDefaults from '../../../../.github.config.json';
import { dbConnection } from '../../../../lib/db/connection';
import type { NextApiRequest, NextApiResponse } from 'next';
import { signToken } from '../../../utils/withAdminAuth';
import HttpStatus from '../../../utils/StatusCodes';
import { User } from '../../../../lib/db/Models';
import { apiResponseData } from '../../../types';
import withAuth from '../../../utils/withAuth';


dbConnection();

export const doesUserExist = async (email: string): Promise<boolean> => {
    try {
        const user = await User.findOne({ email }); //NOSONAR
        return !!user;
    } catch (error) {
        return false;
    }
};

// /api/admin/sign-up
export default function handler(
    req: NextApiRequest,
    res: NextApiResponse): apiResponseData {


    // Ensures a basic level of authentication;
    return withAuth(req, res,
        async () => {
            const { name, email, password } = req.body;

            if (name && password && email) {
                // only allow the default user to create an account
                const allowedUsername = gitHubDefaults.username;

                if (name !== allowedUsername) {
                    return res.status(HttpStatus.UNAUTHORIZED).json(
                        { error: { message: 'Unauthorized' } }
                    );
                }

                // check if the user already exists
                const user = await doesUserExist(email);// NOSONAR

                if (user) {
                    return res.status(HttpStatus.FORBIDDEN).json(
                        { error: { message: 'Forbidden' } }
                    );
                } else {
                    // create the user
                    try {
                        const newUser = await User.create(
                            { name, email, password });

                        // sign the token
                        const token = signToken(newUser);

                        return res.status(HttpStatus.CREATED).json(
                            { data: { name, token } });
                    } catch (error) {
                        /*@ts-ignore*/
                        if (error?._message === 'User validation failed') { //NOSONAR
                            return res.status(HttpStatus.BAD_REQUEST).json(
                                /*@ts-ignore*/
                                { error: { message: error?.errors?.name } });
                        }
                        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
                            { error: { message: 'Internal Server Error' } });
                    }
                }
            } else {
                return res.status(HttpStatus.BAD_REQUEST).json(
                    {
                        error: {
                            message: 'A username, password, and valid email are required'
                        }
                    });
            }
        }
    );
}
