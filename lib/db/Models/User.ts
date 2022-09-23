import { Schema, model } from 'mongoose';
import { ProjectCollectionType } from './Project';
import bcrypt from 'bcrypt';

export interface UserInterface {
    name: string;
    email: string;
    password: string;
    avatar?: string;
    pinnedProjects: ProjectCollectionType;
    attacheCase: ProjectCollectionType;
}

export type UserModel = {
    _id: Schema.Types.ObjectId;
    name: string;
    email: string;
    password: string;
    avatar?: string;
    pinnedProjects: ProjectCollectionType;
    attacheCase: ProjectCollectionType;
};

const defaultRounds = 10;

const userSchema = new Schema<UserInterface>({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: [/.+@.+\..+/, 'Must match an email address!']
    },
    password: {
        type: String,
        required: true,
        minlength: 18
    },
    avatar: {
        type: String,
        required: false,
        default: null
    },
    pinnedProjects: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Project'
        }
    ],
    attacheCase: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Attache'
        }
    ]
});

/*istanbul ignore next */
userSchema.pre('save', async function (next) {
    if (this.isNew || this.isModified('password')) {
        const saltRounds = process.env.SALT_ROUNDS ? parseInt(process.env.SALT_ROUNDS, 10) : defaultRounds;
        this.password = await bcrypt.hash(this.password, saltRounds);
    }

    next();
});

userSchema.methods.isCorrectPassword = async function (password: string) {
    return bcrypt.compare(password, this.password);
};

const User = model<UserInterface>('User', userSchema);

export default User;
