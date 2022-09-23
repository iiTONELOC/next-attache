import connect from '../../../lib/db/connection';
import { Project } from '../../../lib/db/Models';

let db;

beforeEach(async () => {
    db = await connect();
    await Project.deleteMany({});
});

afterEach(async () => {
    await db.close();
});

const testProjectData = {
    name: 'Test Project',
    size: 100,
    license: 'MIT',
    description: 'This is a test project',
    repoUrl: 'test.com',
    liveUrl: 'test.com',
    cloneUrl: 'test.com',
    demoUrl: 'test.com',
    createdAt: Date.now().toString(),
    updatedAt: Date.now().toString(),
    openIssues: 0,
    topLanguage: 'javascript',
    screenshotUrl: 'test.com'
};

describe('Project Model', () => {
    it('should create a new project', async () => {
        const project = await Project.create({ ...testProjectData });

        expect(project).toBeDefined();
        expect(project.name).toBe(testProjectData.name);
        expect(project.size).toBe(testProjectData.size);
        expect(project.license).toBe(testProjectData.license);
        expect(project.repoUrl).toBe(testProjectData.repoUrl);
        expect(project.demoUrl).toBe(testProjectData.demoUrl);
        expect(project.liveUrl).toBe(testProjectData.liveUrl);
        expect(project.cloneUrl).toBe(testProjectData.cloneUrl);
        expect(project.createdAt).toBe(testProjectData.createdAt);
        expect(project.updatedAt).toBe(testProjectData.updatedAt);
        expect(project.openIssues).toBe(testProjectData.openIssues);
        expect(project.topLanguage).toBe(testProjectData.topLanguage);
        expect(project.description).toBe(testProjectData.description);
        expect(project.screenshotUrl).toBe(testProjectData.screenshotUrl);
    });
});
