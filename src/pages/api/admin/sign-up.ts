import gitHubDefaults from '../../../../.github.config.json';
import type { NextApiRequest, NextApiResponse } from 'next';
import { signToken } from '../../../utils/withAdminAuth';
import connect from '../../../../lib/db/connection';
import { User } from '../../../../lib/db/Models';
import { apiResponseData } from '../../../types';
import withAuth from '../../../utils/withAuth';
import { Connection } from 'mongoose';
import HttpStatus from '../../../utils/StatusCodes';


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

    let db: Connection | Error | null = null;

    // Ensures a basic level of authentication;
    return withAuth(req, res,
        async () => {
            // connect to the database
            db = await connect();
            // get the user data from the request body
            const { name, email, password } = req.body;

            if (name && password && email) {

                // only allow the default user to create an account
                const allowedUsername = gitHubDefaults.username;
                if (name !== allowedUsername) {
                    return res.status(HttpStatus.UNAUTHORIZED).json({ error: { message: 'Unauthorized' } });
                }

                // check if the user already exists
                const user = await doesUserExist(email);// NOSONAR
                if (user) {
                    /*@ts-ignore*/
                    await db?.close();
                    return res.status(HttpStatus.FORBIDDEN).json({ error: { message: 'Forbidden' } });
                } else {
                    // create the user
                    try {
                        const newUser = await User.create({ name, email, password });

                        // sign the token
                        const token = signToken(newUser);

                        // close connection to db
                        /*@ts-ignore*/
                        await db?.close();

                        // return the token
                        return res.status(HttpStatus.CREATED).json({ data: { name, token } });
                    } catch (error) {
                        // close connection to db
                        /*@ts-ignore*/
                        await db?.close();
                        console.error(error);

                        // handle creation errors
                        /*@ts-ignore*/
                        if (error?._message === 'User validation failed') {
                            /*@ts-ignore*/
                            return res.status(HttpStatus.BAD_REQUEST).json({ error: { message: error?.errors?.name } });
                        }
                        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: { message: 'Internal Server Error' } });
                    }
                }
            } else {
                /*@ts-ignore*/
                await db?.close();
                return res.status(HttpStatus.BAD_REQUEST).json({ error: { message: 'A username, password, and valid email are required' } });
            }
        }
    );
}
