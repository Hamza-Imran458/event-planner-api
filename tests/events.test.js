const request = require('supertest');
const app = require('../server');
const { resetTestData } = require('../models/testData');

describe('Event Endpoints', () => {
    // Reset the data before each test
    beforeEach(() => {
        resetTestData();
    });

    // Keep a token across the protected route tests if we want to
    let token;

    beforeAll(async () => {
        // Generate an auth token for admin to use in protected routes
        const authRes = await request(app)
            .post('/login')
            .send({ username: 'admin', password: 'password123' });
        token = authRes.body.token;
    });

    describe('GET /events', () => {
        it('should return all events', async () => {
            const response = await request(app).get('/events');
            expect(response.status).toBe(200);
            expect(response.body.length).toBe(3);
            expect(response.body[0].name).toBe('Test Event 1');
        });
    });

    describe('GET /events/:id', () => {
        it('should return a specific event by ID', async () => {
            const response = await request(app).get('/events/1');
            expect(response.status).toBe(200);
            expect(response.body.name).toBe('Test Event 1');
        });

        it('should return 404 for non-existent event ID', async () => {
            const response = await request(app).get('/events/999');
            expect(response.status).toBe(404);
        });
    });

    describe('POST /events', () => {
        it('should create new event with valid token', async () => {
            const response = await request(app)
                .post('/events')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    name: 'New Test Event',
                    date: '2025-12-25',
                    location: 'New Location',
                    description: 'New Description'
                });

            expect(response.status).toBe(201);
            expect(response.body.name).toBe('New Test Event');
        });

        it('should fail to create event without token', async () => {
            const response = await request(app)
                .post('/events')
                .send({
                    name: 'Unauthorized Event',
                    date: '2025-12-25',
                    location: 'New Location',
                    description: 'New Description'
                });

            expect(response.status).toBe(401);
            expect(response.body.message).toMatch(/unauthorized/i);
        });

        it('should fail to create event with missing fields', async () => {
            const response = await request(app)
                .post('/events')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    name: 'Incomplete Event'
                    // missing date, location, description
                });

            expect(response.status).toBe(400); // Bad Request
            expect(response.body.message).toBeDefined();
        });
    });

    describe('PUT /events/:id', () => {
        it('should update event with valid token', async () => {
            const response = await request(app)
                .put('/events/1')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    name: 'Updated Event Name'
                });

            expect(response.status).toBe(200);
            expect(response.body.name).toBe('Updated Event Name');
        });

        it('should return 404 when updating non-existent event ID', async () => {
            const response = await request(app)
                .put('/events/999')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    name: 'Updated Event Name'
                });

            expect(response.status).toBe(404);
        });
    });

    describe('DELETE /events/:id', () => {
        it('should delete event with valid token', async () => {
            const response = await request(app)
                .delete('/events/1')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.message).toMatch(/deleted/i);

            // Verify it's actually deleted
            const getRes = await request(app).get('/events/1');
            expect(getRes.status).toBe(404);
        });

        it('should return 404 when deleting non-existent event ID', async () => {
            const response = await request(app)
                .delete('/events/999')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(404);
        });
    });
});
