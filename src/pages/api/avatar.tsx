import type { NextApiRequest, NextApiResponse } from 'next';
import GitHubAPI from '../../../lib/GitHubAPI';

const gitHubAPI = new GitHubAPI();

// api/avatar
export default async function handler(
    req: NextApiRequest, res: NextApiResponse
) {
    const urlData = await gitHubAPI.getAvatarURL();
    return res.status(200).json(urlData.data);
}

