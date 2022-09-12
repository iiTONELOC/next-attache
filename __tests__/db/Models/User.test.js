import connect from '../../../lib/db/connection';
import { User } from '../../../lib/db/models';

describe('User Model', () => {
    it('should create a new user', async () => {
        const db = await connect();
        await User.deleteMany();

        const user = await User.create({
            name: 'test',
            password: 'test67891023456789',
            email: 'test@test.com'
        });

        expect(user).toBeDefined();
        expect(user.name).toBe('test');
        expect(user.email).toBe('test@test.com');
        expect(user.avatar).toBe(null);
        expect(user.password).not.toBe('test67891023456789');
        expect(await user.isCorrectPassword('test67891023456789')).toBe(true);

        await User.deleteMany();
        db.close();
    });

});
