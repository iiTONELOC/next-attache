import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

interface UserInterface {
    name: string;
    email: string;
    password: string;
    avatar?: string;
}

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
    }
});

userSchema.pre('save', async function (next) {
    if (this.isNew || this.isModified('password')) {
        const saltRounds = process.env.SALT_ROUNDS || defaultRounds;
        this.password = await bcrypt.hash(this.password, saltRounds);
    }

    next();
});

userSchema.methods.isCorrectPassword = async function (password: string) {
    return bcrypt.compare(password, this.password);
};

const User = model('User', userSchema);

export default User;
