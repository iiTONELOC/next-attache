import { tryCatch } from './helpers';
import type { ObjectId } from 'mongoose';
import { dbConnection } from '../connection';
import User, { UserModel } from '../Models/User';

dbConnection();

/**
 * Attempts to find a user by email, username, or _id
 * @param props.name The user's name
 * @param props._id The user's _id
 * @param props.email The email of the user to be found
 * @returns true if the user exists, false otherwise
 */
const doesUserExist = async (props: {
    name?: string;
    email?: string,
    _id?: string | ObjectId
}): Promise<boolean> => {
    try {
        const { email, _id, name } = props;

        if (email || _id || name) {
            const user: UserModel | null = email ?
                await User.findOne({ email }) : //NOSONAR
                _id ? await User.findById({ _id }) : //NOSONAR
                    await User.findOne({ name }); //NOSONAR

            return !!user;
        } else {
            return false;
        }
    } catch (error) {
        // console.error(error);
        return false;
    }
};

const lookUpUserBy = {
    email: async (email: string): Promise<UserModel | null> => tryCatch(async () => User.findOne({ email })),
    _id: async (_id: string | ObjectId): Promise<UserModel | null> => tryCatch(async () => User.findById({ _id })),
    name: async (name: string): Promise<UserModel | null> => tryCatch(async () => User.findOne({ name }))
};

export type createUserProps = {
    name: UserModel['name'];
    email: UserModel['email'];
    password: UserModel['password'];
};

const createUser = async (props: createUserProps): Promise<UserModel | null> => tryCatch(async () => User.create({ ...props }));

export { doesUserExist, lookUpUserBy, createUser };

const defaultExport = {
    createUser,
    doesUserExist,
    lookUpUserBy
};

export default defaultExport;
