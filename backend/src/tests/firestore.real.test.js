import { test, describe } from 'node:test';
import assert from 'node:assert';
import { isFirebaseConfigured, getFirestoreDb } from '../config/firebase.js';
import firestoreService from '../services/firestore.service.js';

describe('Real Firebase / Firestore Live Integration Verification', () => {
  test('Verify Firebase Admin SDK active initialization state', () => {
    const configured = isFirebaseConfigured();
    const db = getFirestoreDb();
    console.log(`[FIREBASE TEST] Admin SDK Configured: ${configured}`);
    assert.strictEqual(configured, true, 'Firebase Admin SDK should be initialized with project weathergpt-bf6ba');
    assert.ok(db, 'Firestore Database instance should be non-null');
  });

  test('Perform real Firestore live CRUD operations & verify cleanup', async () => {
    const testDocId = `real_test_${Date.now()}`;
    const testUserData = {
      displayName: 'Real Firestore Integration Test User',
      email: 'integration-test@weathergpt.ai',
      contextMode: 'travel',
      temperatureUnit: 'celsius',
      theme: 'dark'
    };

    // 1. Create / Update User Profile in live Firestore
    const createdUser = await firestoreService.createOrUpdateUser(testDocId, testUserData);
    assert.strictEqual(createdUser.userId, testDocId);
    assert.strictEqual(createdUser.displayName, testUserData.displayName);

    // 2. Fetch User Profile from live Firestore
    const fetchedUser = await firestoreService.getUser(testDocId);
    assert.ok(fetchedUser, 'Fetched user document must exist in Firestore');
    assert.strictEqual(fetchedUser.email, testUserData.email);

    // 3. Save Search History
    const searchRecord = await firestoreService.saveSearchHistory(testDocId, {
      query: 'Jodhpur, Rajasthan',
      latitude: 26.2389,
      longitude: 73.0243
    });
    assert.ok(searchRecord.id, 'Search history document must return generated Firestore ID');

    // 4. Query Search History
    const historyList = await firestoreService.getSearchHistory(testDocId, 5);
    assert.ok(Array.isArray(historyList));
    assert.ok(historyList.length > 0);
    assert.strictEqual(historyList[0].query, 'Jodhpur, Rajasthan');

    // 5. Cleanup Test Artifacts in Live Firestore
    const db = getFirestoreDb();
    await db.collection('users').doc(testDocId).delete();
    if (searchRecord.id) {
      await db.collection('searchHistory').doc(searchRecord.id).delete();
    }

    // Verify cleanup
    const postCleanupUser = await firestoreService.getUser(testDocId);
    assert.strictEqual(postCleanupUser, null, 'Test user document should be cleanly deleted from Firestore');
  });
});
