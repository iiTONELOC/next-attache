import { Schema, model, models } from 'mongoose';
import { ProjectCollectionType } from './Project';

export interface AttacheInterface {
    name: string;
    createdAt: Date;
    updatedAt: Date;
    notes?: string;
    projects: ProjectCollectionType;
    resume: string;
}
export type AttacheModel = {
    _id: Schema.Types.ObjectId;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    notes?: string;
    projects: ProjectCollectionType;
    resume: string;
};

const attacheSchema = new Schema<AttacheInterface>({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    notes: {
        type: String,
        required: false,
        default: null,
        unique: false,
        trim: true,
        maxLength: 500
    },
    projects: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Project'
        }
    ],
    resume: {
        type: String,
        required: true,
        unique: false,
        trim: true
    }
},
    {
        timestamps: true
    });

const Attache = models['Attache'] ? model<AttacheInterface>('Attache') : model<AttacheInterface>('Attache', attacheSchema);

export default Attache;
