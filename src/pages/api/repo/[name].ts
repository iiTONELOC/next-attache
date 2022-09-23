import type { apiResponseData, repoData } from '../../../types';
import { dbConnection } from '../../../../lib/db/connection';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Project } from '../../../../lib/db/Models';
import HttpStatus from '../../../utils/StatusCodes';
import GitHubAPI from '../../../../lib/GitHubAPI';
import withAuth from '../../../utils/withAuth';


dbConnection();

export async function findRepo(req: NextApiRequest) {
    const { name } = req.query;
    return Project.findOne({ name });
}


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
export const getRepo = async (
    req: NextApiRequest,
    res: NextApiResponse
) => {
    // look up repo in database
    // if repo isn't found, fetch it from GitHub and create it in the database
    // if the repo is found in the db, return it

    const { name, liveUrlType } = req.query;

    const repoInDb = await findRepo(req); //NOSONAR
    if (repoInDb) {
        // TO DO UPDATE THE REPO IF NEEDED
        return res.status(HttpStatus.OK).json({ data: repoInDb });
    } else {
        // not found in db, fetch from GitHub
        const gitHubAPI = new GitHubAPI();
        const repo = await gitHubAPI.getRepoByName(name as string);
        /**
          * If we grab the screenshot first, we can benefit from the cached
          * response when reading for the demoURL. Either call will cache the
          * readme but the getRepoScreenshot requires extra data so an
          * external fetch is always required, even if the readme exists in
          * the cache. Before returning the response we should manually clear
          * the readme from the cache, because this isn't actively managed and
          * not clearing it will result in not receiving fresh updates.
          */
        const repoScreenshot = await gitHubAPI.getRepoScreenshot(name as string);
        const demoURL = await gitHubAPI.getDemoURL(name as string);
        /*@ts-ignore*/
        const liveUrl = await gitHubAPI.getLiveUrl(name as string, liveUrlType || 'pinned');

        // clear the cache
        gitHubAPI.clearItemFromCache(name as string);

        const data: repoData = {
            ...repo.data,
            screenshotUrl: repoScreenshot.data.screenshotUrl,
            demoUrl: demoURL.data.demoUrl || '',
            liveUrl: liveUrl.data.liveUrl
        };

        // create the repo in the database
        try {
            await Project.create({ ...data });
        } catch (error) {
            console.error(error);
        }
        return res.status(repo.status).json({
            data: { ...data }
        });
    }
};

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { method, query } = req;

    return withAuth(req, res, async () => {
        try {

            if (method === 'GET') {
                const repo = await getRepo(req, res);
                return repo;
            } else if (method === 'POST' && query.liveUrlType === 'dynamic') {
                const existingRepo = await getRepo(req, res);
                return existingRepo;
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
    });
}
