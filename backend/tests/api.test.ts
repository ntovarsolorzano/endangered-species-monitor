import request from 'supertest';
import app from '../src/app';

describe('Species API', () => {
  it('GET /species should return all species', async () => {
    const res = await request(app).get('/species');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('GET /species/:id should return a specific species', async () => {
    const res = await request(app).get('/species/vaquita');
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Vaquita');
  });

  it('GET /species/:id should return 404 for non-existent species', async () => {
    const res = await request(app).get('/species/unknown');
    expect(res.status).toBe(404);
  });

  it('GET /species/search should return matching species', async () => {
    const res = await request(app).get('/species/search?q=rhino');
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].name).toContain('Rhino');
  });
});

describe('User Impact API', () => {
  it('POST /impact should record user impact', async () => {
    const impactData = {
      userId: 'testuser',
      actionsTaken: ['recycled'],
      carbonFootprintReduced: 5,
      donations: 10
    };
    const res = await request(app).post('/impact').send(impactData);
    expect(res.status).toBe(201);
    expect(res.body.userId).toBe('testuser');
  });

  it('GET /impact/:userId should retrieve user impact', async () => {
    const impactData = {
      userId: 'testuser2',
      actionsTaken: ['recycled'],
      carbonFootprintReduced: 5,
      donations: 10
    };
    await request(app).post('/impact').send(impactData);

    const res = await request(app).get('/impact/testuser2');
    expect(res.status).toBe(200);
    expect(res.body.userId).toBe('testuser2');
  });
});
