import { test, describe } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import app from '../app.js';

describe('Validation Middleware Tests', () => {
  test('Reject missing coordinates query parameters', async () => {
    const res = await request(app).get('/api/v1/weather');

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
    assert.strictEqual(res.body.error.code, 'VALIDATION_ERROR');
  });

  test('Reject invalid latitude out of range (< -90)', async () => {
    const res = await request(app).get('/api/v1/weather?lat=-95.0&lon=75.0');

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
    assert.strictEqual(res.body.error.code, 'VALIDATION_ERROR');
    assert.match(res.body.error.message, /Latitude must be a valid number/);
  });

  test('Reject invalid longitude out of range (> 180)', async () => {
    const res = await request(app).get('/api/v1/weather?lat=25.0&lon=190.0');

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
    assert.strictEqual(res.body.error.code, 'VALIDATION_ERROR');
    assert.match(res.body.error.message, /Longitude must be a valid number/);
  });

  test('Reject empty search query', async () => {
    const res = await request(app).get('/api/v1/locations/search?q=');

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
    assert.strictEqual(res.body.error.code, 'VALIDATION_ERROR');
  });

  test('Reject invalid date range (endDate before startDate)', async () => {
    const res = await request(app).get('/api/v1/historical?lat=26.23&lon=73.02&startDate=2026-09-20&endDate=2026-09-10');

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
    assert.strictEqual(res.body.error.code, 'VALIDATION_ERROR');
    assert.match(res.body.error.message, /endDate cannot be earlier than startDate/);
  });

  test('Reject empty chat message payload', async () => {
    const res = await request(app)
      .post('/api/v1/chat')
      .send({ message: '' });

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
    assert.strictEqual(res.body.error.code, 'VALIDATION_ERROR');
  });
});
