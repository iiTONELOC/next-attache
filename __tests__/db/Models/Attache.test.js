import connect from '../../../lib/db/connection';
import { Attache } from '../../../lib/db/Models';

let db;

beforeEach(async () => {
    db = await connect();
    await Attache.deleteMany({});
});

afterEach(async () => {
    await Attache.deleteMany({});
    await db.close();
});

describe('Attache model', () => {
    it('Should create a new attache', async () => {
        const attache = await Attache.create({
            name: 'test',
            notes: 'This is a test attache',
            resume: 'Test url for resume'
        });

        expect(attache).toBeDefined();
        expect(attache.name).toBe('test');
        expect(attache.projects).toEqual([]);
        expect(attache.resume).toBe('Test url for resume');
        expect(attache.notes).toBe('This is a test attache');
        expect(new Date(attache.createdAt).getTime()).toBeLessThanOrEqual(Date.now());
        expect(new Date(attache.updatedAt).getTime()).toBeLessThanOrEqual(Date.now());
    });
});
