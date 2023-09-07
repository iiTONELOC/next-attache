import type { NextApiRequest, NextApiResponse } from 'next';
import { dbConnection } from '../../lib/db/connection';
import { apiResponseData } from '../types';
import { User } from '../../lib/db/Models';
import { extractToken } from './withAppAuth';
import HttpStatus from './StatusCodes';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';


dbConnection();

type userDataType = {
    username: string;
    email: string;
    _id: ObjectId;
};

export const signToken: Function = ({ username, email, _id }: userDataType): string => {
    const payload: userDataType = { username, email, _id };

    return jwt.sign({ data: payload },
        process.env.JWT_SECRET || '',
        { expiresIn: process.env.JWT_EXP || '' });
};

/**
 *  Authentication middleware for Next.js Admin API & routes
 *  Requires a valid JSON token to be attached to the request header
 * @param req NextApiRequest
 * @param res NextApiResponse
 * @param callback Function to execute if the request is authenticated
 */
export default async function withAdminAuth(
    req: NextApiRequest,
    res: NextApiResponse,
    callback: Function): Promise<apiResponseData | void> {

    const { headers } = req;
    const { authorization } = headers;

    if (authorization) {
        const token = extractToken(authorization);
        try {

            /*@ts-ignore*/
            const { data } = jwt.verify(
                token,
                process.env.JWT_SECRET || '',
                { maxAge: process.env.JWT_EXP || '' }
            );

            // TODO: Check if the user exists in the database
            const user = await User.findById({ _id: data?._id });// NOSONAR
            if (user) {
                return callback({ authData: data });
            } else {

                return res.status(HttpStatus.UNAUTHORIZED).json({ error: { message: 'Unauthorized' } });
            }

        } catch (error) {

            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: { message: 'Server error' } });
        }
    } else {
        return res.status(HttpStatus.UNAUTHORIZED).json({ error: { message: 'Unauthorized' } });
    }
}
