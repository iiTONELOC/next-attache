import { getDataAndUpdate } from '../pages/api/repo/[name]';
import { dbConnection } from '../../lib/db/connection';
import { Project } from '../../lib/db/Models';

export function updateDatabase() {
    dbConnection();

    async function update() {
        console.log('Updating database...');
        // get a list of all the repo names from the database
        // for each repo name, fetch the data from GitHub and update the database
        const repoNames = (await Project.find({}).select('name -_id')).map(({ name }) => name);
        for (const name of repoNames) {
            await getDataAndUpdate(name);
        }
        console.log('Database updated!');
    }

    update().catch(console.error);
}


setTimeout(updateDatabase, 1000 * 60 * 1); // update the database every 5 minutes

// allow this to be called from the command line
if (require.main === module) {
    updateDatabase();
}

