import request from 'supertest';
import { createApp } from '../../../infrastructure/server/app';
import { Application } from 'express';

describe('Route API', () => {
  let app: Application;

  beforeAll(() => {
    app = createApp();
  });

  describe('GET /routes', () => {
    it('should return all routes', async () => {
      const response = await request(app).get('/routes');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should filter routes by year', async () => {
      const response = await request(app).get('/routes?year=2024');
      
      expect(response.status).toBe(200);
      expect(response.body.every((r: { year: number }) => r.year === 2024)).toBe(true);
    });

    it('should filter routes by vesselType', async () => {
      const response = await request(app).get('/routes?vesselType=Container');
      
      expect(response.status).toBe(200);
      expect(response.body.every((r: { vesselType: string }) => r.vesselType === 'Container')).toBe(true);
    });
  });

  describe('POST /routes/:id/baseline', () => {
    it('should set route as baseline', async () => {
      const response = await request(app)
        .post('/routes/R002/baseline');
      
      expect(response.status).toBe(200);
      expect(response.body.isBaseline).toBe(true);
      expect(response.body.routeId).toBe('R002');
    });

    it('should return error for non-existent route', async () => {
      const response = await request(app)
        .post('/routes/INVALID/baseline');
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });
  });

  describe('GET /routes/comparison', () => {
    it('should return comparison data', async () => {
      // First set a baseline
      await request(app).post('/routes/R001/baseline');
      
      const response = await request(app).get('/routes/comparison');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      
      const comparison = response.body[0];
      expect(comparison).toHaveProperty('baseline');
      expect(comparison).toHaveProperty('comparison');
      expect(comparison).toHaveProperty('percentDiff');
      expect(comparison).toHaveProperty('compliant');
    });
  });
});

describe('Health Check', () => {
  let app: Application;

  beforeAll(() => {
    app = createApp();
  });

  it('should return health status', async () => {
    const response = await request(app).get('/health');
    
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });
});
