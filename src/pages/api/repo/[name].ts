import GitHubAPI from '../../../../lib/GitHubAPI';
import HttpStatus from '../../../utils/StatusCodes';
import withAppAuth from '../../../utils/withAppAuth';
import type { NextApiRequest, NextApiResponse } from 'next';
import { dbConnection } from '../../../../lib/db/connection';
import { ProjectModel } from '../../../../lib/db/Models/Project';
import { ProjectController } from '../../../../lib/db/controller';


const { getProjectBy, updateProjectBy, createProject } = ProjectController;
const gitHubAPI = new GitHubAPI();

dbConnection();

/**
 * Fetches the data for a single repo.
 * @return
 * ```js
 * {
        name: string;
        htmlUrl: string;
        description: string;
        language: string;
        createdAt: string;
        updatedAt: string;
        openIssues: string;
        cloneUrl: string;
        size: number;
        commitsUrl: string;
        license: string;
        screenshotUrl?: string;
        demoUrl?: string;
        liveUrl?: string;
    }
    ```
 */
export const handleProjectLookUp = async (
    req: NextApiRequest,
    res: NextApiResponse
) => {
    const { name, liveUrlType } = req.query;
    // look up repo in database
    const repoInDb = await getProjectBy.name(name as string); //NOSONAR

    if (repoInDb) {


        // get fresh data from GitHub
        const gitHubData = await gitHubAPI.getRepoByName(name as string, 'dynamic');
        const { data } = gitHubData;

        // update database with fresh data
        const updatedRepo = await updateProjectBy.name(name as string, {
            ...data
        });

        // return updated data to the client
        return res.status(HttpStatus.OK).json({ data: updatedRepo._doc });

    } else {
        // Repo doesn't exist in database yet let's add it
        const repo = await gitHubAPI.getRepoByName(name as string,
            liveUrlType === 'dynamic' ? 'dynamic' : 'pinned');

        const data: ProjectModel = { ...repo.data };

        // create the repo in the database
        const newProject = await createProject(data);

        // return the new repo to the client
        return newProject && res.status(repo.status).json({
            /*@ts-ignore*/
            data: { ...newProject._doc }
        });
    }
};

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { method } = req;
    // Basic GET route needs withAppAuth

    // Other methods will require admin validation

    try {
        // For fetching a single repo
        if (method === 'GET') {

            return withAppAuth(req, res, async () => handleProjectLookUp(req, res));

        } else {
            return res.status(HttpStatus.METHOD_NOT_ALLOWED).json({
                error: { message: 'Method not allowed' }
            });
        }
    } catch (error: any) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            error: error?.message || 'Something went wrong'
        });
    }
}
