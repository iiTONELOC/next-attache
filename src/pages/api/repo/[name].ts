// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { repoByName } from '../../../../lib/GitHubAPI/types';
import type { NextApiRequest, NextApiResponse } from 'next';
import GitHubAPI from '../../../../lib/GitHubAPI';
import withAuth from '../../../utils/withAuth';

export type repoData = repoByName & {
    screenshotURL?: string
};

export type responseData = {
    data: repoData | {}
};

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
    }
    ```
 */
export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<responseData>
) {
    const { query } = req;
    const { name } = query;


    return withAuth(req, res, async () => {
        try {
            const gitHubAPI = new GitHubAPI();
            const repo = await gitHubAPI.getRepoByName(name as string);
            const repoScreenshot = await gitHubAPI.getRepoScreenshot(name as string);
            const data: repoData = { ...repo.data, screenshotURL: repoScreenshot.data.screenshotURL };

            return res.status(repo.status).json({
                data: { ...data }
            });
        } catch (error) {
            return res.status(500).json({
                data: {}
            });
        }
    });
}
