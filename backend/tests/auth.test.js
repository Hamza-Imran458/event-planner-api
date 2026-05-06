const request = require('supertest');
const app = require('../server');
const { resetTestData } = require('../src/shared/testData');

describe('Auth Endpoints', () => {
  beforeEach(() => {
    resetTestData();
  });

  describe('POST /login', () => {
    it('should login with valid credentials', async () => {
      const response = await request(app).post('/login').send({
        username: 'admin',
        password: 'password123',
      });

      expect(response.status).toBe(200);
      expect(response.body.token).toBeDefined();
      expect(typeof response.body.token).toBe('string');
    });

    it('should fail with invalid password', async () => {
      const response = await request(app).post('/login').send({
        username: 'admin',
        password: 'wrongpassword',
      });

      expect(response.status).toBe(401);
      expect(response.body.message).toMatch(/invalid/i);
    });

    it('should fail with invalid username', async () => {
      const response = await request(app).post('/login').send({
        username: 'wronguser',
        password: 'password123',
      });

      expect(response.status).toBe(401);
      expect(response.body.message).toMatch(/invalid/i);
    });
  });

  describe('Protected Routes Access', () => {
    let validToken;

    beforeEach(async () => {
      const loginRes = await request(app)
        .post('/login')
        .send({ username: 'user', password: 'user123' });
      validToken = loginRes.body.token;
    });

    it('should access protected route with valid token', async () => {
      const response = await request(app)
        .post('/events')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          name: 'Protected Event',
          date: '2025-10-10',
          time: '10:30',
          location: 'Anywhere',
          description: 'Desc',
        });

      expect(response.status).toBe(201);
    });

    it('should deny access with invalid token', async () => {
      const response = await request(app)
        .post('/events')
        .set('Authorization', 'Bearer invalid-token-string')
        .send({
          name: 'Protected Event',
          date: '2025-10-10',
          time: '10:30',
          location: 'Anywhere',
          description: 'Desc',
        });

      expect([401, 403]).toContain(response.status);
    });

    it('should deny access with no token', async () => {
      const response = await request(app).post('/events').send({
        name: 'Protected Event',
        date: '2025-10-10',
        time: '10:30',
        location: 'Anywhere',
        description: 'Desc',
      });

      expect(response.status).toBe(401);
    });
  });
});
