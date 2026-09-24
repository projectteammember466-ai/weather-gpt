import { test, describe } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import app from '../app.js';

describe('Location Search API Endpoint', () => {
  test('GET /api/v1/locations/search?q=Delhi returns normalized location objects', async () => {
    const res = await request(app).get('/api/v1/locations/search?q=Delhi');

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(Array.isArray(res.body.data));
    assert.ok(res.body.data.length > 0);

    const first = res.body.data[0];
    assert.ok(first.name);
    assert.ok(typeof first.latitude === 'number');
    assert.ok(typeof first.longitude === 'number');
    assert.ok(first.country);
  });
});
