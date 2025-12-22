const request = require('supertest');
const app = require('../server'); 

describe('Backend API Tests', () => {
  it('should return a 200 status for the health check', async () => {
    const res = await request(app).get('/api/health'); 
    expect(res.statusCode).toEqual(200);
  });
});