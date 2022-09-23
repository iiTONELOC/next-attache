import { Schema, model, Types } from 'mongoose';

export interface ProjectInterface {
    name: string;
    size: number;
    license: string;
    repoUrl: string;
    demoUrl?: string;
    liveUrl?: string;
    cloneUrl: string;
    createdAt: string;
    updatedAt: string;
    openIssues: number;
    description?: string;
    topLanguage: string;
    screenshotUrl: string;
}
// I know I can extend but the IDE may or may not
// show the extended types in the editor so this is
// a bit more explicit and user friendly
export type ProjectModel = {
    _id: Types.ObjectId;
    name: string;
    size: number;
    license: string;
    repoUrl: string;
    demoUrl?: string;
    liveUrl?: string;
    cloneUrl: string;
    createdAt: string;
    updatedAt: string;
    openIssues: number;
    description: string;
    topLanguage: string;
    screenshotUrl: string;
};

export type ProjectCollectionType = Types.ObjectId[] | ProjectInterface[] | [];

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
        required: false,
        default: null,
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
    demoUrl: {
        type: String,
        default: null,
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
        default: null,
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

const Project = model<ProjectInterface>('Project', projectSchema);

export default Project;
