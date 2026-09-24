import { test, describe } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import app from '../app.js';

describe('Health API Endpoint', () => {
  test('GET /api/v1/health should return 200 and healthy status payload', async () => {
    const res = await request(app).get('/api/v1/health');

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.service, 'WeatherGPT Backend');
    assert.strictEqual(res.body.data.status, 'healthy');
    assert.ok(res.body.data.timestamp);
    assert.ok(res.body.data.firebase);
  });

  test('GET /unknown-route should return 404 NOT_FOUND', async () => {
    const res = await request(app).get('/api/v1/nonexistent-endpoint');

    assert.strictEqual(res.status, 404);
    assert.strictEqual(res.body.success, false);
    assert.strictEqual(res.body.error.code, 'NOT_FOUND');
  });
});
