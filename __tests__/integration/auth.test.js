require('dotenv').config();
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../src/app');
const User = require('../../src/models/User');
const { hashPassword } = require('../../src/utils/auth'); // Import hashing tool

let mongoServer;

// Setting up the database connection once for all tests
beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
});

// Cleaning database after each test
afterEach(async () => {
    await User.deleteMany({});   
});

// Closing database connection once for all tests
afterAll(async () => {
    await mongoose.connection.close();
    await mongoServer.stop();
});

// Un-commented and fixed registration tests for complete coverage
describe('POST /auth/register', () => {
    test('should register a new user and return token', async () => {
        const res = await request(app)
            .post('/auth/register')
            .send({
                name: 'Juan',
                email: 'juan@gmail.com',
                password: '123456'
            });

        expect(res.status).toBe(201);
        expect(res.body.message).toBe('Registered successfull!');
        expect(res.body.token).toBeTruthy();
        expect(res.body.user.email).toBe('juan@gmail.com');
        expect(res.body.user.name).toBe('Juan');
        expect(res.body.user.password).toBeUndefined();
    });

    test('should return 400 if email already exists', async () => {
        await request(app)
            .post('/auth/register')
            .send({ name: 'Juan', email: 'juan@gmail.com', password: '123456' });

        const res = await request(app)
            .post('/auth/register')
            .send({ name: 'Juanito', email: 'juan@gmail.com', password: '123456' });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Email already in use');
    });

    test('should hash the password before saving', async () => {
        await request(app)
            .post('/auth/register')
            .send({ name: 'Juan', email: 'juan@gmail.com', password: '123456' });

        const user = await User.findOne({ email: 'juan@gmail.com' });

        expect(user.password).not.toBe('123456');
        expect(user.password).toMatch(/^\$2[ab]\$/);
    });
});

// Cleaned single Login suite
describe('Post /auth/login', () => {
    beforeEach(async () => {
        // Correctly hash the password before inserting into MongoMemoryServer
        const hashedPassword = await hashPassword('123456');
        await User.create({
            name: 'Juan',
            email: 'juan@gmail.com',
            password: hashedPassword 
        });
    });

    test('should login successful with correct credentials', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({ email: 'juan@gmail.com', password: '123456' });

        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Login successful!'); // Exact match with controller
        expect(res.body.token).toBeTruthy();
    });

    test('should return 401 for wrong password', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({ email: 'juan@gmail.com', password: 'wrongpassword' });

        expect(res.status).toBe(401);
        expect(res.body.message).toBe('Invalid credentials');
    });

    test('should return 400 if something missing', async () => { 
        const res = await request(app)
            .post('/auth/login')
            .send({ email: 'juan@gmail.com' });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe('All fields are required');
    });
});
