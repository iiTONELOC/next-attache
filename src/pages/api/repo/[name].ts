import GitHubAPI from '../../../../lib/GitHubAPI';
import HttpStatus from '../../../utils/StatusCodes';
import withAppAuth from '../../../utils/withAppAuth';
import type { NextApiRequest, NextApiResponse } from 'next';
import { dbConnection } from '../../../../lib/db/connection';
import { ProjectController } from '../../../../lib/db/controller';


const { getProjectBy, updateProjectBy, createProject } = ProjectController;

dbConnection();

/**
 * Fetches the data for a single repo.
 * @return
 * ```js
 * {
 *   name: string;
 *   htmlUrl: string;
 *   description: string;
 *   language: string;
 *   createdAt: string;
 *   updatedAt: string;
 *   openIssues: string;
 *   cloneUrl: string;
 *   size: number;
 *   commitsUrl: string;
 *   license: string;
 *   screenshotUrl?: string;
 *   demoUrl?: string;
 *   liveUrl?: string;
 * }
 * ```
 */
export const handleProjectLookUp = async (
    req: NextApiRequest,
    res: NextApiResponse
) => {
    const { name } = req.query;

    try {
        // Look up repo in the database
        const repoInDb = await getProjectBy.name(name as string);

        if (repoInDb) {
            return res.status(HttpStatus.OK).json({ data: repoInDb });
        } else {
            // Fetch the data from GitHub
            const gitHubData = await getDataAndUpdate(name as string, false);

            // Return the fetched data to the client
            return gitHubData ? res.status(gitHubData.status).json({ data: gitHubData.data }) :
                res.status(HttpStatus.NOT_FOUND).json({
                    errors: [{ message: 'Project not found' }]
                });
        }
    } catch (error: any) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            error: error?.message || 'Something went wrong',
        });
    }
};

// Fetches the data from GitHub and updates the database
export const getDataAndUpdate = async (name: string, doesExist = true) => {
    const gitHubData = await GitHubAPI.getRepoByName(
        name, 'dynamic'
    );
    const { data, errors } = gitHubData;

    if (errors) {
        for (const error of errors) {
            throw new Error(error.message);
        }
    }

    try {

        if (!doesExist) {
            const created = await createProject({ ...data });
            return created;
        } else {
            // Perform the database update asynchronously
            const updated = await updateProjectBy.name(name, { ...data });
            return updated?._doc ?? data;
        }

    } catch (error) {
        console.error(error);
        console.error('Error updating project in the background');
        console.error('Project name: ', name);
        console.error('Project data: ', data);
        return null;
    }
};


export default function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { method } = req;

    try {
        // For fetching a single repo
        if (method === 'GET') {
            withAppAuth(req, res, async () => handleProjectLookUp(req, res));
        } else {
            res.status(HttpStatus.METHOD_NOT_ALLOWED).json({
                error: { message: 'Method not allowed' },
            });
        }
    } catch (error: any) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            error: error?.message || 'Something went wrong',
        });
    }
};
