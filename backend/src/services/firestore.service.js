import { getFirestoreDb, isFirebaseConfigured } from '../config/firebase.js';

// In-memory fallback store when Firebase Admin is not configured
const inMemoryStore = {
  users: new Map(),
  searchHistory: new Map(), // userId -> array
  chatHistory: new Map(),   // userId -> array
  savedLocations: new Map(), // userId -> array
  alertPreferences: new Map()
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
    // Write to user subcollection users/{userId}/searchHistory/{searchId}
    const subcollRef = db.collection('users').doc(targetUserId).collection('searchHistory').doc(searchId);
    await subcollRef.set(record);

    // Update statistics on user root document
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
      // Subcollection users/{userId}/searchHistory
      const subSnapshot = await db.collection('users').doc(targetUserId).collection('searchHistory').get();
      if (!subSnapshot.empty) {
        const docs = subSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        docs.sort((a, b) => new Date(b.searchedAt || b.createdAt || 0) - new Date(a.searchedAt || a.createdAt || 0));
        return docs.slice(0, limit);
      }
      return [];
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
    await db.collection('users').doc(targetUserId).collection('searchHistory').doc(searchId).delete();
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
    const subcollRef = db.collection('users').doc(targetUserId).collection('chatHistory').doc(chatId);
    await subcollRef.set(record);

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
      const subSnapshot = await db.collection('users').doc(targetUserId).collection('chatHistory').get();
      if (!subSnapshot.empty) {
        const docs = subSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        docs.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        return docs.slice(0, limit);
      }
      return [];
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
    const subcollRef = db.collection('users').doc(targetUserId).collection('savedLocations').doc(locationId);
    await subcollRef.set(record);

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
    await db.collection('users').doc(targetUserId).collection('savedLocations').doc(locationId).delete();
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
      const subSnapshot = await db.collection('users').doc(targetUserId).collection('savedLocations').get();
      if (!subSnapshot.empty) {
        return subSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      }
      return [];
    } catch (err) {
      console.warn('Firestore getSavedLocations error:', err.message);
    }
  }

  return inMemoryStore.savedLocations.get(targetUserId) || [];
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
    await db.collection('users').doc(targetUserId).collection('alertPreferences').doc('default').set(record, { merge: true });
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
      const subDoc = await db.collection('users').doc(targetUserId).collection('alertPreferences').doc('default').get();
      if (subDoc.exists) {
        return subDoc.data();
      }
      return null;
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
  saveAlertPreferences,
  getAlertPreferences
};
