import type { apiResponseData, repoData } from '../../../types';
import type { NextApiRequest, NextApiResponse } from 'next';
import GitHubAPI from '../../../../lib/GitHubAPI';
import withAuth from '../../../utils/withAuth';


/**
 * Fetches the data for a single repo.
 * @return
 * ```js
 * {
        name: string;
        html_url: string;
        description: string;
        language: string;
        created_at: string;
        updated_at: string;
        open_issues: string;
        clone_url: string;
        size: number;
        commits_url: string;
        license: {
            name: string;
        }
        screenshotURL?: string;
        demoURL?: string;
        liveURL?: string;
    }
    ```
 */
export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<apiResponseData>
) {
    const { query } = req;
    const { name } = query;


    return withAuth(req, res, async () => {
        try {
            const gitHubAPI = new GitHubAPI();
            const repo = await gitHubAPI.getRepoByName(name as string);
            const repoScreenshot = await gitHubAPI.getRepoScreenshot(name as string);
            const demoURL = await gitHubAPI.getDemoURL(name as string);
            const liveURL = await gitHubAPI.getLiveURL(name as string);

            const data: repoData = {
                ...repo.data,
                screenshotURL: repoScreenshot.data.screenshotURL,
                demoURL: demoURL.data.demoURL,
                liveURL: liveURL.data.liveURL
            };

            return res.status(repo.status).json({
                data: { ...data }
            });
        } catch (error: any) {
            return res.status(500).json({
                error: error?.message || 'Something went wrong'
            });
        }
    });
}
