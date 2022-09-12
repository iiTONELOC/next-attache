describe('Database Connection', () => {
    it('should connect to the database', async () => {
        const connection = require('../../lib/db/connection').default;
        const db = await connection();
        expect(db).toBeDefined();
        db.close();
    });
});
