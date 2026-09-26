import { test, describe } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import app from '../app.js';

describe('Complete Master API Endpoints Integration Test', () => {
  const testUserId = `usr_master_${Date.now()}`;

  test('GET /api/v1/alerts returns alerts status structure', async () => {
    const res = await request(app).get('/api/v1/alerts?lat=26.2389&lon=73.0243&city=Jodhpur');

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(Array.isArray(res.body.data.alerts));
    assert.ok(res.body.data.officialStatus);
  });

  test('Saved Locations CRUD API (/api/v1/locations/saved)', async () => {
    // 1. Save location
    const postRes = await request(app)
      .post('/api/v1/locations/saved')
      .send({
        userId: testUserId,
        name: 'Jaipur',
        city: 'Jaipur',
        country: 'India',
        latitude: 26.9124,
        longitude: 75.7873
      });

    assert.strictEqual(postRes.status, 201);
    assert.strictEqual(postRes.body.success, true);
    assert.ok(postRes.body.data.id);
    const locationId = postRes.body.data.id;

    // 2. Fetch saved locations
    const getRes = await request(app).get(`/api/v1/locations/saved?userId=${testUserId}`);
    assert.strictEqual(getRes.status, 200);
    assert.strictEqual(getRes.body.success, true);
    assert.ok(Array.isArray(getRes.body.data));
    assert.ok(getRes.body.data.some(l => l.name === 'Jaipur'));

    // 3. Delete saved location
    const delRes = await request(app).delete(`/api/v1/locations/saved/${testUserId}/${locationId}`);
    assert.strictEqual(delRes.status, 200);
    assert.strictEqual(delRes.body.success, true);
  });

  test('Search and Chat History API (/api/v1/history/search & /api/v1/history/chat)', async () => {
    // 1. Post search history
    const searchRes = await request(app)
      .post('/api/v1/history/search')
      .send({
        userId: testUserId,
        query: 'Udaipur',
        latitude: 24.5854,
        longitude: 73.7125
      });
    assert.strictEqual(searchRes.status, 201);

    // 2. Fetch search history
    const getSearchRes = await request(app).get(`/api/v1/history/search?userId=${testUserId}`);
    assert.strictEqual(getSearchRes.status, 200);
    assert.ok(getSearchRes.body.data.length > 0);

    // 3. Post chat history
    const chatRes = await request(app)
      .post('/api/v1/history/chat')
      .send({
        userId: testUserId,
        sessionId: 'sess-1',
        message: 'Is it going to rain in Udaipur?',
        response: 'No rain expected today.',
        intent: 'RAIN'
      });
    assert.strictEqual(chatRes.status, 201);

    // 4. Fetch chat history
    const getChatRes = await request(app).get(`/api/v1/history/chat?userId=${testUserId}`);
    assert.strictEqual(getChatRes.status, 200);
    assert.ok(getChatRes.body.data.length > 0);
  });

  test('User Settings API (/api/v1/user/settings)', async () => {
    // 1. Patch user settings
    const patchRes = await request(app)
      .patch('/api/v1/user/settings')
      .send({
        userId: testUserId,
        language: 'hi',
        temperatureUnit: 'celsius',
        contextMode: 'farmer'
      });

    assert.strictEqual(patchRes.status, 200);
    assert.strictEqual(patchRes.body.data.language, 'hi');
    assert.strictEqual(patchRes.body.data.contextMode, 'farmer');

    // 2. Get user settings
    const getSetRes = await request(app).get(`/api/v1/user/settings?userId=${testUserId}`);
    assert.strictEqual(getSetRes.status, 200);
    assert.strictEqual(getSetRes.body.data.contextMode, 'farmer');
  });
});
