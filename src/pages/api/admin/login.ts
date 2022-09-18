import type { NextApiRequest, NextApiResponse } from 'next';
import { signToken } from '../../../utils/withAdminAuth';
import connect from '../../../../lib/db/connection';
import { User } from '../../../../lib/db/Models';
import { apiResponseData } from '../../../types';
import withAuth from '../../../utils/withAuth';
import { Connection } from 'mongoose';

// /api/admin/login
export default function handler(req: NextApiRequest, res: NextApiResponse): apiResponseData {
    let db: Connection | Error | null = null;
    // Ensures a basic level of authentication;
    return withAuth(req, res,
        async () => {
            db = await connect();
            // get the user data from the request body
            const { name, password } = req.body;

            if (name && password) {

                // look up the user
                const user = await User.findOne({ name });// NOSONAR

                if (user) {
                    // verify the password
                    /*@ts-ignore*/
                    if (await user.isCorrectPassword(password)) {
                        // sign a token with the user data
                        // FIXME: Encrypt the _id

                        const token = signToken({ name, password, _id: user._id });
                        // disconnect
                        /*@ts-ignore*/
                        await db?.close();
                        return res.status(200).json({ data: { token } });
                    } else {
                        // disconnect
                        /*@ts-ignore*/
                        await db?.close();
                        return res.status(400).json({ error: { message: 'Incorrect credentials' } });
                    }
                } else {
                    // disconnect
                    /*@ts-ignore*/
                    await db?.close();
                    return res.status(401).json({ error: { message: 'Unauthorized' } });
                }

            } else {
                // disconnect
                /*@ts-ignore*/
                await db?.close();
                return res.status(401).json({ error: { message: 'Unauthorized' } });
            }
        }
    );
}
