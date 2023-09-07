import { tryCatch } from './helpers';
import { dbConnection } from '../connection';
import Attache, { AttacheInterface, AttacheModel } from '../Models/Attache';

dbConnection();

export type AttacheData = AttacheModel | null;

// Create a new attache
const createAttache = async (props: Partial<AttacheInterface>): Promise<AttacheData> => tryCatch(async () => Attache.create({ ...props }));

// Get a list of all the attache id's
const getAttacheIds = async (): Promise<Partial<AttacheData>[]> => tryCatch(async () => Attache.find().select('_id'));

// Get an attache by id
const getAttacheById = async (id: string): Promise<AttacheData> => tryCatch(async () => Attache.findById({ _id: id }).populate({ path: 'projects' }));

export { createAttache, getAttacheIds, getAttacheById };

const defaultExports = { createAttache, getAttacheIds, getAttacheById };
export default defaultExports;
