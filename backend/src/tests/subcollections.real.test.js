import { test, describe } from 'node:test';
import assert from 'node:assert';
import { isFirebaseConfigured, getFirestoreDb } from '../config/firebase.js';
import firestoreService from '../services/firestore.service.js';

describe('Firestore User-Scoped Subcollection Architecture Verification', () => {

  test('Verify organized subcollections and root user statistics in live Firestore', async () => {
    const testUserId = `usr_subcoll_test_${Date.now()}`;
    const db = getFirestoreDb();
    const isLive = isFirebaseConfigured() && db;

    console.log(`[SUBCOLLECTION TEST] Live Firestore configured: ${Boolean(isLive)} for user ${testUserId}`);

    // 1. Create User with structured root document
    const userPayload = {
      displayName: 'Architecture Test User',
      email: 'arch-test@weathergpt.ai',
      language: 'en',
      temperatureUnit: 'celsius',
      contextMode: 'farmer',
      theme: 'dark'
    };
    const createdUser = await firestoreService.createOrUpdateUser(testUserId, userPayload);
    assert.strictEqual(createdUser.userId, testUserId);
    assert.strictEqual(createdUser.profile.displayName, 'Architecture Test User');
    assert.strictEqual(createdUser.preferences.contextMode, 'farmer');

    // 2. Add Search History with full telemetry and verify subcollection document
    const searchRecord = await firestoreService.saveSearchHistory(testUserId, {
      rawQuery: 'jodhpur fort',
      resolvedName: 'Jodhpur',
      location: 'Jodhpur, Rajasthan, India',
      latitude: 26.2389,
      longitude: 73.0243,
      country: 'India',
      state: 'Rajasthan',
      source: 'search',
      isCurrentLocation: false,
      weatherSnapshot: {
        temperature: 34.5,
        condition: 'Clear Sky',
        humidity: 42,
        windSpeed: 14.2
      }
    });

    assert.ok(searchRecord.id, 'Search record must have an ID');
    assert.strictEqual(searchRecord.resolvedName, 'Jodhpur');
    assert.strictEqual(searchRecord.rawQuery, 'jodhpur fort');
    assert.strictEqual(searchRecord.weatherSnapshot.temperature, 34.5);

    if (isLive) {
      // Direct inspection of users/{userId}/searchHistory/{searchId}
      const subDocRef = db.collection('users').doc(testUserId).collection('searchHistory').doc(searchRecord.id);
      const subDoc = await subDocRef.get();
      assert.strictEqual(subDoc.exists, true, 'Document MUST physically exist at users/{userId}/searchHistory/{searchId}');
      assert.strictEqual(subDoc.data().weatherSnapshot.temperature, 34.5);
      assert.strictEqual(subDoc.data().resolvedName, 'Jodhpur');
    }

    // 3. Add Saved Location and verify subcollection document
    const locRecord = await firestoreService.saveLocation(testUserId, {
      name: 'Udaipur',
      city: 'Udaipur',
      latitude: 24.5854,
      longitude: 73.7125,
      country: 'India',
      state: 'Rajasthan'
    });

    assert.ok(locRecord.id, 'Saved location must have an ID');

    if (isLive) {
      // Direct inspection of users/{userId}/savedLocations/{locationId}
      const locSubDocRef = db.collection('users').doc(testUserId).collection('savedLocations').doc(locRecord.id);
      const locSubDoc = await locSubDocRef.get();
      assert.strictEqual(locSubDoc.exists, true, 'Document MUST physically exist at users/{userId}/savedLocations/{locationId}');
      assert.strictEqual(locSubDoc.data().name, 'Udaipur');
    }

    // 4. Update Dashboard Preferences and verify subcollection document
    const dashPrefs = await firestoreService.updateDashboardPreferences(testUserId, {
      visibleSections: { currentWeather: true, weatherMap: false },
      sectionOrder: ['currentWeather', 'smartGuidance']
    });
    assert.strictEqual(dashPrefs.visibleSections.weatherMap, false);

    if (isLive) {
      // Direct inspection of users/{userId}/dashboardPreferences/default
      const dashSubDocRef = db.collection('users').doc(testUserId).collection('dashboardPreferences').doc('default');
      const dashSubDoc = await dashSubDocRef.get();
      assert.strictEqual(dashSubDoc.exists, true, 'Document MUST physically exist at users/{userId}/dashboardPreferences/default');
      assert.strictEqual(dashSubDoc.data().visibleSections.weatherMap, false);
    }

    // 5. Verify root user statistics counters were updated
    if (isLive) {
      const userDoc = await db.collection('users').doc(testUserId).get();
      assert.strictEqual(userDoc.exists, true);
      const userData = userDoc.data();
      assert.ok(userData.statistics, 'Root user doc must have statistics object');
      assert.strictEqual(userData.statistics.totalSearches >= 1, true, 'totalSearches counter must be >= 1');
      assert.strictEqual(userData.statistics.totalSavedLocations >= 1, true, 'totalSavedLocations counter must be >= 1');
    }

    // 6. Test deleteSearchHistory cleans up subcollection
    const deleteResult = await firestoreService.deleteSearchHistory(testUserId, searchRecord.id);
    assert.strictEqual(deleteResult.success, true);

    if (isLive) {
      const deletedDoc = await db.collection('users').doc(testUserId).collection('searchHistory').doc(searchRecord.id).get();
      assert.strictEqual(deletedDoc.exists, false, 'Deleted search history document should no longer exist');
    }

    // 7. Cleanup remaining test artifacts
    if (isLive) {
      await db.collection('users').doc(testUserId).collection('savedLocations').doc(locRecord.id).delete();
      await db.collection('users').doc(testUserId).collection('dashboardPreferences').doc('default').delete();
      await db.collection('users').doc(testUserId).delete();
      // Also clean backwards-compat top-level documents if created
      await db.collection('savedLocations').doc(locRecord.id).delete();
      await db.collection('dashboardPreferences').doc(testUserId).delete();
    }
  });

});
