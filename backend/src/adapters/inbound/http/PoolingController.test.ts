import request from 'supertest';
import { createApp } from '../../../infrastructure/server/app';
import { Application } from 'express';

describe('Pool API', () => {
  let app: Application;

  beforeAll(() => {
    app = createApp();
  });

  describe('POST /pools', () => {
    it('should create a pool with valid members', async () => {
      const response = await request(app)
        .post('/pools')
        .send({
          year: 2024,
          members: [
            { shipId: 'SHIP1', cb: 1000 },
            { shipId: 'SHIP2', cb: -500 },
          ],
        });
      
      expect(response.status).toBe(201);
      expect(response.body.pool).toBeDefined();
      expect(response.body.members).toBeDefined();
      expect(response.body.isValid).toBe(true);
    });

    it('should reject pool with sum CB < 0', async () => {
      const response = await request(app)
        .post('/pools')
        .send({
          year: 2024,
          members: [
            { shipId: 'SHIP1', cb: -1000 },
            { shipId: 'SHIP2', cb: -500 },
          ],
        });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Sum of CB must be >= 0');
    });

    it('should require year and members', async () => {
      const response = await request(app)
        .post('/pools')
        .send({});
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });
  });
});
