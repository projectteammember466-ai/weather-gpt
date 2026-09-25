import { getFirestoreDb, isFirebaseConfigured } from '../config/firebase.js';

// In-memory fallback store when Firebase Admin is not configured
const inMemoryStore = {
  users: new Map(),
  searchHistory: new Map(), // userId -> array
  chatHistory: new Map(),   // userId -> array
  savedLocations: new Map(), // userId -> array
  alertPreferences: new Map(),
  dashboardPreferences: new Map()
};

/**
 * USERS SERVICE
 * Document Path: users/{userId}
 */
export async function createOrUpdateUser(userId, userData = {}) {
  const targetUserId = userId || 'anonymous';
  const now = new Date().toISOString();

  const db = getFirestoreDb();
  if (isFirebaseConfigured() && db) {
    const userRef = db.collection('users').doc(targetUserId);
    const doc = await userRef.get();
    const existing = doc.exists ? doc.data() : {};

    const profile = {
      displayName: userData.displayName ?? existing.profile?.displayName ?? existing.displayName ?? '',
      email: userData.email ?? existing.profile?.email ?? existing.email ?? '',
      language: userData.language ?? existing.profile?.language ?? existing.language ?? 'en',
      temperatureUnit: userData.temperatureUnit ?? existing.profile?.temperatureUnit ?? existing.temperatureUnit ?? 'celsius',
      createdAt: existing.profile?.createdAt || existing.createdAt || now
    };

    const preferences = {
      language: userData.language ?? existing.preferences?.language ?? existing.language ?? 'en',
      temperatureUnit: userData.temperatureUnit ?? existing.preferences?.temperatureUnit ?? existing.temperatureUnit ?? 'celsius',
      contextMode: userData.contextMode ?? existing.preferences?.contextMode ?? existing.contextMode ?? 'general',
      theme: userData.theme ?? existing.preferences?.theme ?? existing.theme ?? 'dark',
      updatedAt: now
    };

    const statistics = {
      totalSearches: existing.statistics?.totalSearches ?? 0,
      totalChats: existing.statistics?.totalChats ?? 0,
      totalSavedLocations: existing.statistics?.totalSavedLocations ?? 0,
      lastActiveAt: now
    };

    const metadata = {
      createdAt: existing.metadata?.createdAt || existing.createdAt || now,
      updatedAt: now,
      lastActiveAt: now
    };

    const userPayload = {
      userId: targetUserId,
      profile,
      preferences,
      statistics,
      metadata,

      // Top-level fields for backwards compatibility
      displayName: profile.displayName,
      email: profile.email,
      language: profile.language,
      contextMode: preferences.contextMode,
      temperatureUnit: profile.temperatureUnit,
      theme: preferences.theme,
      createdAt: metadata.createdAt,
      updatedAt: now,
      lastActiveAt: now
    };

    await userRef.set(userPayload, { merge: true });
    return userPayload;
  }

  // Fallback in-memory
  const existing = inMemoryStore.users.get(targetUserId) || {};
  const merged = {
    userId: targetUserId,
    profile: {
      displayName: userData.displayName || existing.profile?.displayName || '',
      email: userData.email || existing.profile?.email || '',
      language: userData.language || existing.profile?.language || 'en',
      temperatureUnit: userData.temperatureUnit || existing.profile?.temperatureUnit || 'celsius',
      createdAt: existing.profile?.createdAt || now
    },
    preferences: {
      language: userData.language || existing.preferences?.language || 'en',
      temperatureUnit: userData.temperatureUnit || existing.preferences?.temperatureUnit || 'celsius',
      contextMode: userData.contextMode || existing.preferences?.contextMode || 'general',
      theme: userData.theme || existing.preferences?.theme || 'dark',
      updatedAt: now
    },
    statistics: {
      totalSearches: existing.statistics?.totalSearches || 0,
      totalChats: existing.statistics?.totalChats || 0,
      totalSavedLocations: existing.statistics?.totalSavedLocations || 0,
      lastActiveAt: now
    },
    metadata: {
      createdAt: existing.metadata?.createdAt || now,
      updatedAt: now,
      lastActiveAt: now
    },
    displayName: userData.displayName || existing.displayName || '',
    email: userData.email || existing.email || '',
    language: userData.language || existing.language || 'en',
    contextMode: userData.contextMode || existing.contextMode || 'general',
    temperatureUnit: userData.temperatureUnit || existing.temperatureUnit || 'celsius',
    theme: userData.theme || existing.theme || 'dark',
    updatedAt: now
  };

  inMemoryStore.users.set(targetUserId, merged);
  return merged;
}

export async function getUser(userId) {
  const targetUserId = userId || 'anonymous';
  const db = getFirestoreDb();
  if (isFirebaseConfigured() && db) {
    const doc = await db.collection('users').doc(targetUserId).get();
    return doc.exists ? doc.data() : null;
  }

  return inMemoryStore.users.get(targetUserId) || null;
}

/**
 * SEARCH HISTORY SERVICE
 * Subcollection Path: users/{userId}/searchHistory/{searchId}
 */
export async function saveSearchHistory(userId, searchData = {}) {
  const targetUserId = userId || 'anonymous';
  const now = new Date().toISOString();
  const searchId = searchData.searchId || `search_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

  const record = {
    id: searchId,
    searchId,
    userId: targetUserId,
    query: searchData.resolvedName || searchData.city || searchData.query || searchData.rawQuery || '',
    rawQuery: searchData.rawQuery || searchData.query || searchData.resolvedName || '',
    resolvedName: searchData.resolvedName || searchData.city || searchData.query || '',
    displayName: searchData.location || searchData.displayName || searchData.resolvedName || searchData.query || '',
    latitude: searchData.latitude ?? searchData.lat ?? null,
    longitude: searchData.longitude ?? searchData.lon ?? null,
    country: searchData.country || '',
    countryCode: searchData.countryCode || '',
    state: searchData.state || searchData.region || '',
    timezone: searchData.timezone || 'Asia/Kolkata',
    source: searchData.source || 'open-meteo-geocoding',
    searchType: searchData.searchType || 'text',
    isCurrentLocation: Boolean(searchData.isCurrentLocation),
    weatherSnapshot: searchData.weatherSnapshot || (searchData.temperature !== undefined ? {
      temperature: searchData.temperature,
      apparentTemperature: searchData.feelsLike ?? searchData.temperature,
      condition: searchData.condition || 'Clear Sky',
      humidity: searchData.humidity ?? 45,
      windSpeed: searchData.windSpeed ?? 12,
      precipitationProbability: searchData.rainProbability ?? 0
    } : null),
    createdAt: now,
    updatedAt: now,
    searchedAt: now
  };

  const db = getFirestoreDb();
  if (isFirebaseConfigured() && db) {
    // 1. Write to user subcollection users/{userId}/searchHistory/{searchId}
    const subcollRef = db.collection('users').doc(targetUserId).collection('searchHistory').doc(searchId);
    await subcollRef.set(record);

    // 2. Write to top-level searchHistory for backwards compatibility
    await db.collection('searchHistory').doc(searchId).set(record);

    // 3. Increment statistics on user root document
    const userRef = db.collection('users').doc(targetUserId);
    await userRef.set({
      userId: targetUserId,
      statistics: {
        totalSearches: (await subcollRef.parent.get()).size,
        lastActiveAt: now
      },
      metadata: { lastActiveAt: now }
    }, { merge: true });

    return record;
  }

  // In-memory fallback
  const list = inMemoryStore.searchHistory.get(targetUserId) || [];
  list.unshift(record);
  inMemoryStore.searchHistory.set(targetUserId, list);
  return record;
}

export async function getSearchHistory(userId, limit = 10) {
  const targetUserId = userId || 'anonymous';
  const db = getFirestoreDb();

  if (isFirebaseConfigured() && db) {
    try {
      // 1. Primary: Subcollection users/{userId}/searchHistory
      const subSnapshot = await db.collection('users').doc(targetUserId).collection('searchHistory').get();
      if (!subSnapshot.empty) {
        const docs = subSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        docs.sort((a, b) => new Date(b.searchedAt || b.createdAt || 0) - new Date(a.searchedAt || a.createdAt || 0));
        return docs.slice(0, limit);
      }

      // 2. Fallback: Top-level searchHistory collection
      const topSnapshot = await db.collection('searchHistory')
        .where('userId', '==', targetUserId)
        .get();
      if (!topSnapshot.empty) {
        const docs = topSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        docs.sort((a, b) => new Date(b.searchedAt || b.createdAt || 0) - new Date(a.searchedAt || a.createdAt || 0));
        return docs.slice(0, limit);
      }
    } catch (err) {
      console.warn('Firestore getSearchHistory error:', err.message);
    }
  }

  const list = inMemoryStore.searchHistory.get(targetUserId) || [];
  return list.slice(0, limit);
}

export async function deleteSearchHistory(userId, searchId) {
  const targetUserId = userId || 'anonymous';
  const db = getFirestoreDb();

  if (isFirebaseConfigured() && db) {
    // Delete from subcollection
    await db.collection('users').doc(targetUserId).collection('searchHistory').doc(searchId).delete();
    // Delete from top-level collection if present
    await db.collection('searchHistory').doc(searchId).delete();
    return { success: true, searchId };
  }

  const list = inMemoryStore.searchHistory.get(targetUserId) || [];
  const filtered = list.filter(item => item.searchId !== searchId && item.id !== searchId);
  inMemoryStore.searchHistory.set(targetUserId, filtered);
  return { success: true, searchId };
}

/**
 * CHAT HISTORY SERVICE
 * Subcollection Path: users/{userId}/chatHistory/{chatId}
 */
export async function saveChatMessage(userId, chatData = {}) {
  const targetUserId = userId || 'anonymous';
  const now = new Date().toISOString();
  const chatId = chatData.chatId || `chat_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

  const record = {
    id: chatId,
    chatId,
    userId: targetUserId,
    sessionId: chatData.sessionId || `session_${Date.now()}`,
    message: chatData.message || '',
    response: chatData.response || '',
    intent: chatData.intent || 'GENERAL',
    contextMode: chatData.contextMode || 'general',
    location: typeof chatData.location === 'object' ? {
      name: chatData.location.name || chatData.location.city || '',
      latitude: chatData.location.latitude || chatData.location.lat || null,
      longitude: chatData.location.longitude || chatData.location.lon || null
    } : { name: String(chatData.location || '') },
    language: chatData.language || 'en',
    createdAt: now,
    updatedAt: now
  };

  const db = getFirestoreDb();
  if (isFirebaseConfigured() && db) {
    // Write to subcollection users/{userId}/chatHistory/{chatId}
    const subcollRef = db.collection('users').doc(targetUserId).collection('chatHistory').doc(chatId);
    await subcollRef.set(record);

    // Write to top-level collection for backwards compatibility
    await db.collection('chatHistory').doc(chatId).set(record);

    // Update user statistics
    const userRef = db.collection('users').doc(targetUserId);
    await userRef.set({
      userId: targetUserId,
      statistics: {
        totalChats: (await subcollRef.parent.get()).size,
        lastActiveAt: now
      },
      metadata: { lastActiveAt: now }
    }, { merge: true });

    return record;
  }

  const list = inMemoryStore.chatHistory.get(targetUserId) || [];
  list.unshift(record);
  inMemoryStore.chatHistory.set(targetUserId, list);
  return record;
}

export async function getChatHistory(userId, limit = 20) {
  const targetUserId = userId || 'anonymous';
  const db = getFirestoreDb();

  if (isFirebaseConfigured() && db) {
    try {
      // Subcollection first
      const subSnapshot = await db.collection('users').doc(targetUserId).collection('chatHistory').get();
      if (!subSnapshot.empty) {
        const docs = subSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        docs.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        return docs.slice(0, limit);
      }

      // Top-level fallback
      const topSnapshot = await db.collection('chatHistory')
        .where('userId', '==', targetUserId)
        .get();
      if (!topSnapshot.empty) {
        const docs = topSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        docs.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        return docs.slice(0, limit);
      }
    } catch (err) {
      console.warn('Firestore getChatHistory error:', err.message);
    }
  }

  const list = inMemoryStore.chatHistory.get(targetUserId) || [];
  return list.slice(0, limit);
}

/**
 * SAVED LOCATIONS SERVICE
 * Subcollection Path: users/{userId}/savedLocations/{locationId}
 */
export async function saveLocation(userId, locationData = {}) {
  const targetUserId = userId || 'anonymous';
  const now = new Date().toISOString();
  const locationId = locationData.locationId || locationData.id || `loc_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

  const record = {
    locationId,
    id: locationId,
    userId: targetUserId,
    name: locationData.name || locationData.city || '',
    city: locationData.city || locationData.name || '',
    displayName: locationData.displayName || locationData.name || '',
    country: locationData.country || 'India',
    countryCode: locationData.countryCode || '',
    state: locationData.state || locationData.region || '',
    region: locationData.region || locationData.state || '',
    latitude: locationData.latitude ?? locationData.lat ?? 0,
    longitude: locationData.longitude ?? locationData.lon ?? 0,
    timezone: locationData.timezone || 'Asia/Kolkata',
    createdAt: now,
    updatedAt: now
  };

  const db = getFirestoreDb();
  if (isFirebaseConfigured() && db) {
    // Write to subcollection users/{userId}/savedLocations/{locationId}
    const subcollRef = db.collection('users').doc(targetUserId).collection('savedLocations').doc(locationId);
    await subcollRef.set(record);

    // Write to top-level savedLocations for backwards compatibility
    await db.collection('savedLocations').doc(locationId).set(record);

    // Update user statistics
    const userRef = db.collection('users').doc(targetUserId);
    await userRef.set({
      userId: targetUserId,
      statistics: {
        totalSavedLocations: (await subcollRef.parent.get()).size,
        lastActiveAt: now
      },
      metadata: { lastActiveAt: now }
    }, { merge: true });

    return record;
  }

  const list = inMemoryStore.savedLocations.get(targetUserId) || [];
  const filtered = list.filter(l => l.locationId !== locationId && l.id !== locationId && l.name.toLowerCase() !== record.name.toLowerCase());
  filtered.unshift(record);
  inMemoryStore.savedLocations.set(targetUserId, filtered);
  return record;
}

export async function removeSavedLocation(userId, locationId) {
  const targetUserId = userId || 'anonymous';
  const db = getFirestoreDb();

  if (isFirebaseConfigured() && db) {
    // Delete from subcollection
    await db.collection('users').doc(targetUserId).collection('savedLocations').doc(locationId).delete();
    // Delete from top-level collection
    await db.collection('savedLocations').doc(locationId).delete();
    return { success: true, id: locationId, locationId };
  }

  const list = inMemoryStore.savedLocations.get(targetUserId) || [];
  const filtered = list.filter(loc => loc.id !== locationId && loc.locationId !== locationId && loc.name.toLowerCase() !== String(locationId).toLowerCase());
  inMemoryStore.savedLocations.set(targetUserId, filtered);
  return { success: true, id: locationId, locationId };
}

export async function getSavedLocations(userId) {
  const targetUserId = userId || 'anonymous';
  const db = getFirestoreDb();

  if (isFirebaseConfigured() && db) {
    try {
      // Subcollection first
      const subSnapshot = await db.collection('users').doc(targetUserId).collection('savedLocations').get();
      if (!subSnapshot.empty) {
        return subSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      }

      // Top-level fallback
      const topSnapshot = await db.collection('savedLocations')
        .where('userId', '==', targetUserId)
        .get();
      if (!topSnapshot.empty) {
        return topSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      }
    } catch (err) {
      console.warn('Firestore getSavedLocations error:', err.message);
    }
  }

  return inMemoryStore.savedLocations.get(targetUserId) || [];
}

/**
 * DASHBOARD PREFERENCES SERVICE
 * Subcollection Path: users/{userId}/dashboardPreferences/default
 */
export async function updateDashboardPreferences(userId, prefsData = {}) {
  const targetUserId = userId || 'anonymous';
  const now = new Date().toISOString();

  const payload = {
    userId: targetUserId,
    visibleSections: prefsData.visibleSections || {
      currentWeather: true,
      weatherDetails: true,
      smartGuidance: true,
      weatherTimeline: true,
      weatherChart: true,
      dailyForecast: true,
      alertsAndSummary: true,
      sunMoon: true,
      weatherMap: true,
      climate: true
    },
    sectionOrder: prefsData.sectionOrder || [
      'currentWeather',
      'weatherDetails',
      'smartGuidance',
      'weatherTimeline',
      'weatherChart',
      'dailyForecast',
      'alertsAndSummary',
      'sunMoon',
      'weatherMap',
      'climate'
    ],
    updatedAt: now
  };

  const db = getFirestoreDb();
  if (isFirebaseConfigured() && db) {
    // Write to subcollection users/{userId}/dashboardPreferences/default
    await db.collection('users').doc(targetUserId).collection('dashboardPreferences').doc('default').set(payload, { merge: true });
    // Write to top-level dashboardPreferences/{userId} for backwards compatibility
    await db.collection('dashboardPreferences').doc(targetUserId).set(payload, { merge: true });
    return payload;
  }

  inMemoryStore.dashboardPreferences.set(targetUserId, payload);
  return payload;
}

export async function getDashboardPreferences(userId) {
  const targetUserId = userId || 'anonymous';
  const db = getFirestoreDb();

  if (isFirebaseConfigured() && db) {
    try {
      // Subcollection first
      const subDoc = await db.collection('users').doc(targetUserId).collection('dashboardPreferences').doc('default').get();
      if (subDoc.exists) {
        return subDoc.data();
      }

      // Top-level fallback
      const topDoc = await db.collection('dashboardPreferences').doc(targetUserId).get();
      if (topDoc.exists) {
        return topDoc.data();
      }
    } catch (err) {
      console.warn('Firestore getDashboardPreferences error:', err.message);
    }
  }

  return inMemoryStore.dashboardPreferences.get(targetUserId) || {
    userId: targetUserId,
    visibleSections: {
      currentWeather: true,
      weatherDetails: true,
      smartGuidance: true,
      weatherTimeline: true,
      weatherChart: true,
      dailyForecast: true,
      alertsAndSummary: true,
      sunMoon: true,
      weatherMap: true,
      climate: true
    },
    sectionOrder: [
      'currentWeather',
      'weatherDetails',
      'smartGuidance',
      'weatherTimeline',
      'weatherChart',
      'dailyForecast',
      'alertsAndSummary',
      'sunMoon',
      'weatherMap',
      'climate'
    ],
    updatedAt: new Date().toISOString()
  };
}

/**
 * ALERT PREFERENCES SERVICE
 * Subcollection Path: users/{userId}/alertPreferences/default
 */
export async function saveAlertPreferences(userId, preferencesData = {}) {
  const targetUserId = userId || 'anonymous';
  const now = new Date().toISOString();

  const record = {
    userId: targetUserId,
    preferences: preferencesData.preferences || preferencesData.types || {},
    notificationFrequency: preferencesData.notificationFrequency || preferencesData.frequency || 'immediate',
    updatedAt: now
  };

  const db = getFirestoreDb();
  if (isFirebaseConfigured() && db) {
    // Write to subcollection users/{userId}/alertPreferences/default
    await db.collection('users').doc(targetUserId).collection('alertPreferences').doc('default').set(record, { merge: true });
    // Write to top-level alertPreferences/{userId} for backwards compatibility
    await db.collection('alertPreferences').doc(targetUserId).set(record, { merge: true });
    return record;
  }

  inMemoryStore.alertPreferences.set(targetUserId, record);
  return record;
}

export async function getAlertPreferences(userId) {
  const targetUserId = userId || 'anonymous';
  const db = getFirestoreDb();

  if (isFirebaseConfigured() && db) {
    try {
      // Subcollection first
      const subDoc = await db.collection('users').doc(targetUserId).collection('alertPreferences').doc('default').get();
      if (subDoc.exists) {
        return subDoc.data();
      }

      // Top-level fallback
      const topDoc = await db.collection('alertPreferences').doc(targetUserId).get();
      if (topDoc.exists) {
        return topDoc.data();
      }
    } catch (err) {
      console.warn('Firestore getAlertPreferences error:', err.message);
    }
  }

  return inMemoryStore.alertPreferences.get(targetUserId) || null;
}

export default {
  createOrUpdateUser,
  getUser,
  saveSearchHistory,
  getSearchHistory,
  deleteSearchHistory,
  saveChatMessage,
  getChatHistory,
  saveLocation,
  removeSavedLocation,
  getSavedLocations,
  updateDashboardPreferences,
  getDashboardPreferences,
  saveAlertPreferences,
  getAlertPreferences
};
