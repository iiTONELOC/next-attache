import { tryCatch } from './helpers';
import { dbConnection } from '../connection';
import Attache, { AttacheInterface, AttacheModel } from '../Models/Attache';

dbConnection();

export type AttacheData = AttacheModel | null;

const createAttache = async (props: Partial<AttacheInterface>): Promise<AttacheData> => tryCatch(async () => Attache.create({ ...props }));

export { createAttache };

const defaultExports = { createAttache };
export default defaultExports;
