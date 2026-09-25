import { test, describe } from 'node:test';
import assert from 'node:assert';
import { parseWmoCode } from '../services/weather.service.js';
import request from 'supertest';
import app from '../app.js';

describe('Weather Service & API Endpoints', () => {
  test('WMO weather code parser correctly maps codes', () => {
    assert.deepStrictEqual(parseWmoCode(0), { condition: 'Clear Sky', icon: 'Sun' });
    assert.deepStrictEqual(parseWmoCode(1), { condition: 'Partly Cloudy', icon: 'SunMedium' });
    assert.deepStrictEqual(parseWmoCode(61), { condition: 'Rain', icon: 'CloudRain' });
    assert.deepStrictEqual(parseWmoCode(95), { condition: 'Thunderstorm', icon: 'CloudLightning' });
  });

  test('GET /api/v1/weather returns normalized weather schema for valid coordinates', async () => {
    const res = await request(app).get('/api/v1/weather?lat=26.2389&lon=73.0243&locationName=Jodhpur');

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.data.location);
    assert.strictEqual(res.body.data.location.latitude, 26.2389);
    assert.ok(res.body.data.current);
    assert.ok(typeof res.body.data.current.temperature === 'number');
    assert.ok(typeof res.body.data.current.humidity === 'number');
    assert.ok(res.body.data.current.condition);
    assert.ok(res.body.data.current.aqi);
    assert.ok(
      ['Open-Meteo Weather API', 'WeatherGPT Telemetry Model'].includes(res.body.data.metadata.source),
      `Expected metadata.source to be valid telemetry source, got: ${res.body.data.metadata.source}`
    );
  });

  test('GET /api/v1/forecast returns daily and hourly forecast arrays', async () => {
    const res = await request(app).get('/api/v1/forecast?lat=28.6139&lon=77.2090&days=7');

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(Array.isArray(res.body.data.daily));
    assert.ok(Array.isArray(res.body.data.hourly));
    assert.ok(res.body.data.daily.length > 0);
  });
});
