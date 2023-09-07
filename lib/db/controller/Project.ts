import { tryCatch } from './helpers';
import type { ObjectId } from 'mongoose';
import { dbConnection } from '../connection';
import Project, { ProjectInterface, ProjectModel } from '../Models/Project';

dbConnection();

export type ProjectData = ProjectModel | null;

const getProjectBy = {
    name: async (name: string): Promise<ProjectData> => tryCatch(async () => Project.findOne({ name }).select('-__v')),
    _id: async (_id: string | ObjectId): Promise<ProjectData> => tryCatch(async () => Project.findById({ _id }).select('-__v'))
};

const createProject = async (props: Partial<ProjectInterface>): Promise<ProjectData> => tryCatch(async () => Project.create({ ...props }));

const updateProjectBy = {
    name: async (name: string, props: Partial<ProjectModel>): Promise<any> => tryCatch(async () => Project.findOneAndUpdate({ name }, props, { new: true }).select('-__v')),
    _id: async (_id: string | ObjectId, props: Partial<ProjectModel>): Promise<any> => tryCatch(async () => Project.findByIdAndUpdate({ _id }, props, { new: true }).select('-__v'))
};

export { getProjectBy, updateProjectBy, createProject };
const defaultExports = { getProjectBy, updateProjectBy, createProject };
export default defaultExports;
