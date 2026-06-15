const { hashPassword, comparePassword, generateToken, verifyToken } = require('../../src/utils/auth');

//group related test all together

describe('Auth utils', () => {

    //hash password test
    describe('hashPassword', () => {
        test('should hash a password', async () => {
            const password = '123456';
            const hashed = await hashPassword(password);


            //hash password should be different from original
            expect(hashed).not.toBe(password);

            //hash password should be a string
            expect(typeof hashed).toBe('string');

            //hash password should match bcrypt pattern
            expect(hashed).toMatch(/^\$2[ab]\$/)
        });

        test('should hash different passwords differently', async () => {
            const password = '123456';
            const hashed1 = await hashPassword(password); //should be different every time
            const hashed2 = await hashPassword(password); //should be different every time also

            //should hash different passwords differently
            expect(hashed1).not.toBe(hashed2);
        })
    });

    describe('comparePassword', () => {
        test('should return true for correct password', async () => {
            const password = '123456';
            const hashed = await hashPassword(password);
            const isMatch = await comparePassword(password, hashed);

            expect(isMatch).toBe(true);
        })

        test('should return false for incorrect password', async () => {
            const password = '123456';
            const hashed = await hashPassword(password);
            const isMatch = await comparePassword('wrongpassword', hashed);

            expect(isMatch).toBe(false);
        })
    });

    describe('generateToken', () => {
        test('should generate a valid JWT token', () => {
            const user = { id: '123', name: 'Juan', role: 'customer' }; //sample user
            const token = generateToken(user);


            expect(token).toBeDefined();
            expect(typeof token).toBe('string');

            expect(token.split('.')).toHaveLength(3); //headers, payload, signature

            expect(token).toMatch(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/);

        })

        test('should contain correct user data', () => {
            const user = { id: '123', name: 'Juan', role: 'customer' };
            const token = generateToken(user);
            const decoded = verifyToken(token);


            expect(decoded.name).toBe(user.name);
            expect(decoded.role).toBe(user.role);
        })
    });

    describe('verifyToken', () => {
        test('should verify a valid token', () => {
            const user = { id: '123', name: 'Juan', role: 'customer' };
            const token = generateToken(user);
            const decoded = verifyToken(token);


            expect(decoded.name).toBe(user.name);
            expect(decoded.role).toBe(user.role);
        })

        test('should throw an error for invalid token', () => {
            const token = 'invalidtoken';
            expect(() => verifyToken(token)).toThrow();
        })

        test('should throw an error for tampered token', () => {
            const user = { id: '123', name: 'Juan', role: 'customer' };
            const token = generateToken(user);
            const tampered = token + 'tampered';
            expect(() => verifyToken(tampered)).toThrow();
        })
    })
});