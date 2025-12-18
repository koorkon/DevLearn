const request = require('supertest');
const app = require('../app'); // Adjust the path to your Express app

describe('Backend API Tests', () => {
  it('should return a 200 status for the health check', async () => {
    const res = await request(app).get('/api/health'); // Change this to a real route you have
    expect(res.statusCode).toEqual(200);
  });
});