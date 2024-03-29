import type { NextApiRequest, NextApiResponse } from 'next';
import GitHubAPI from '../../../lib/GitHubAPI';

// api/avatar
export default async function handler(
    req: NextApiRequest, res: NextApiResponse
) {
    const urlData = await GitHubAPI.getAvatarURL();

    return res.status(200).json(urlData.data);
}

