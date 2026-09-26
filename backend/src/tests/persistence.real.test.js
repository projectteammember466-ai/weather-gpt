import { test, describe } from 'node:test';
import assert from 'node:assert';
import { isFirebaseConfigured, getFirestoreDb } from '../config/firebase.js';
import firestoreService from '../services/firestore.service.js';

describe('Real Firestore Persistence Regression Suite (Bug 1 & Bug 2 Verification)', () => {

  test('1. Verify USERS collection real persistence', async () => {
    const testUserId = `usr_test_${Date.now()}`;
    const userData = {
      displayName: 'Persistence Test User',
      email: 'persistence-test@weathergpt.ai',
      language: 'en',
      temperatureUnit: 'celsius',
      theme: 'dark',
      contextMode: 'traveler'
    };

    // Save to Firestore
    const saved = await firestoreService.createOrUpdateUser(testUserId, userData);
    assert.strictEqual(saved.userId, testUserId);
    assert.strictEqual(saved.contextMode, 'traveler');

    // Retrieve from Firestore
    const fetched = await firestoreService.getUser(testUserId);
    assert.ok(fetched, 'User document must be present in Firestore');
    assert.strictEqual(fetched.email, userData.email);

    // Cleanup
    if (isFirebaseConfigured()) {
      const db = getFirestoreDb();
      await db.collection('users').doc(testUserId).delete();
    }
  });



  test('3. Verify SEARCH HISTORY canonical location persistence', async () => {
    const testUserId = `usr_test_sh_${Date.now()}`;
    const canonicalRecord = {
      rawQuery: 'Jaipir', // User typo
      resolvedName: 'Jaipur', // Resolved canonical name
      location: 'Jaipur, Rajasthan, India',
      latitude: 26.9124,
      longitude: 75.7873,
      country: 'India',
      state: 'Rajasthan'
    };

    const saved = await firestoreService.saveSearchHistory(testUserId, canonicalRecord);
    assert.ok(saved.id, 'Search history must return a document ID');
    assert.strictEqual(saved.rawQuery, 'Jaipir');
    assert.strictEqual(saved.query, 'Jaipur');
    assert.strictEqual(saved.latitude, 26.9124);

    const historyList = await firestoreService.getSearchHistory(testUserId, 5);
    assert.ok(Array.isArray(historyList));
    assert.ok(historyList.length > 0);
    assert.strictEqual(historyList[0].query, 'Jaipur');

    // Cleanup
    if (isFirebaseConfigured() && saved.id) {
      const db = getFirestoreDb();
      await db.collection('searchHistory').doc(saved.id).delete();
    }
  });
});
