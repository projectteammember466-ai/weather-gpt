import { test, describe } from 'node:test';
import assert from 'node:assert';
import firestoreService from '../services/firestore.service.js';
import request from 'supertest';
import app from '../app.js';

describe('Firestore Service & User API Endpoints', () => {
  const testUserId = `user_test_${Date.now()}`;

  test('Create or update user profile and retrieve it', async () => {
    const userPayload = {
      userId: testUserId,
      displayName: 'Test User',
      email: 'test@weathergpt.ai',
      language: 'en',
      contextMode: 'travel',
      temperatureUnit: 'celsius',
      theme: 'dark'
    };

    const updated = await firestoreService.createOrUpdateUser(testUserId, userPayload);
    assert.strictEqual(updated.userId, testUserId);
    assert.strictEqual(updated.displayName, 'Test User');
    assert.strictEqual(updated.contextMode, 'travel');

    const fetched = await firestoreService.getUser(testUserId);
    assert.ok(fetched);
    assert.strictEqual(fetched.email, 'test@weathergpt.ai');
  });

  test('Save and fetch search history', async () => {
    await firestoreService.saveSearchHistory(testUserId, {
      query: 'Jodhpur',
      latitude: 26.2389,
      longitude: 73.0243
    });

    const history = await firestoreService.getSearchHistory(testUserId);
    assert.ok(Array.isArray(history));
    assert.ok(history.length > 0);
    assert.strictEqual(history[0].query, 'Jodhpur');
  });

  test('Save, fetch, and remove saved locations', async () => {
    const loc = await firestoreService.saveLocation(testUserId, {
      name: 'Mumbai',
      city: 'Mumbai',
      country: 'India',
      latitude: 19.076,
      longitude: 72.8777
    });

    assert.ok(loc.id);
    assert.strictEqual(loc.name, 'Mumbai');

    const savedList = await firestoreService.getSavedLocations(testUserId);
    assert.ok(savedList.length > 0);

    const removeResult = await firestoreService.removeSavedLocation(testUserId, loc.id);
    assert.strictEqual(removeResult.success, true);
  });

  test('POST /api/v1/chat endpoint returns structured response', async () => {
    const res = await request(app)
      .post('/api/v1/chat')
      .send({
        message: 'What is the weather in Delhi?',
        location: { name: 'Delhi', latitude: 28.6139, longitude: 77.2090 },
        contextMode: 'general',
        language: 'en',
        userId: testUserId
      });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.data.reply);
    assert.ok(res.body.data.intent);
  });
});
