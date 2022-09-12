import { Schema, model } from 'mongoose';

interface ProjectInterface {
    name: string;
    size: number;
    license: string;
    repoUrl: string;
    liveUrl?: string;
    cloneUrl: string;
    createdAt: string;
    updatedAt: string;
    openIssues: number;
    description: string;
    topLanguage: string;
    screenshotUrl: string;
}

const projectSchema = new Schema<ProjectInterface>({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    size: {
        type: Number,
        required: true,
        unique: false
    },
    license: {
        type: String,
        required: true,
        unique: false,
        trim: true
    },
    repoUrl: {
        type: String,
        required: true,
        unique: false,
        trim: true
    },
    liveUrl: {
        type: String,
        required: false,
        default: null,
        unique: false,
        trim: true
    },
    cloneUrl: {
        type: String,
        required: true,
        unique: false,
        trim: true
    },
    createdAt: {
        type: String,
        required: true,
        unique: false,
        trim: true
    },
    updatedAt: {
        type: String,
        required: true,
        unique: false,
        trim: true
    },
    openIssues: {
        type: Number,
        required: true,
        unique: false
    },
    description: {
        type: String,
        required: true,
        unique: false,
        trim: true
    },
    topLanguage: {
        type: String,
        required: true,
        unique: false,
        trim: true
    },
    screenshotUrl: {
        type: String,
        required: true,
        unique: false,
        trim: true
    }
});

const Project = model('Project', projectSchema);

export default Project;
