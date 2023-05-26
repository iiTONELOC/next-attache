import { getDataAndUpdate } from '../pages/api/repo/[name]';
import { spawn } from 'child_process';
import path from 'path';

const updateDb = async (name: string) => await getDataAndUpdate(name);
const cwd = process.cwd();
const pathToFile = path.join(cwd, 'src', 'utils', 'updateDb.ts');


export const updateDBNonBlocking = (name: string) =>  spawn('node', [pathToFile, name]);


// allow for script to be run directly with `node-ts updateDb.ts <name>`
if (require.main === module) {
    const name = process.argv[2];
    (async () => updateDb(name))();
}

