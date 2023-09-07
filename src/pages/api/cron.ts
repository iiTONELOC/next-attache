import type { NextApiRequest, NextApiResponse } from 'next';
import { updateDatabase } from '../../utils/UpdateDb';

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        console.log('cron job running...')
        updateDatabase();
        return res.status(200).json({ message: 'Database updated' });
    } catch (error: any) {
        return res.status(500).json({ error: error.message || 'Something went wrong' });
    }
}