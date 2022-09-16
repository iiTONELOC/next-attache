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
            /**
             * If we grab the screenshot first, we can benefit from the cached response when
             * reading for the demoURL. Either call will cache the readme but the getRepoScreenshot
             * requires extra data so an external fetch is always required, even if the readme exists
             * in the cache. Before returning the response we should manually clear the readme from the
             * cache, because this isn't actively managed and not clearing it will result in not receiving
             * fresh updates.
             */
            const repoScreenshot = await gitHubAPI.getRepoScreenshot(name as string);
            const demoURL = await gitHubAPI.getDemoURL(name as string);
            const liveURL = await gitHubAPI.getLiveURL(name as string);

            // clear the cache
            gitHubAPI.clearItemFromCache(name as string);
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
