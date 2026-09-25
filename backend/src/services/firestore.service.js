import { getFirestoreDb, isFirebaseConfigured } from '../config/firebase.js';

// In-memory fallback store when Firebase Admin is not configured
const inMemoryStore = {
  users: new Map(),
  searchHistory: [],
  chatHistory: [],
  savedLocations: new Map(),
  alertPreferences: new Map()
};

/**
 * USERS SERVICE
 */
export async function createOrUpdateUser(userId, userData) {
  const payload = {
    userId,
    displayName: userData.displayName || '',
    email: userData.email || '',
    language: userData.language || 'en',
    contextMode: userData.contextMode || 'general',
    temperatureUnit: userData.temperatureUnit || 'celsius',
    theme: userData.theme || 'dark',
    updatedAt: new Date().toISOString()
  };

  const db = getFirestoreDb();
  if (isFirebaseConfigured() && db) {
    const userRef = db.collection('users').doc(userId);
    const doc = await userRef.get();
    if (!doc.exists) {
      payload.createdAt = new Date().toISOString();
    }
    await userRef.set(payload, { merge: true });
    return payload;
  }

  // Fallback in-memory
  const existing = inMemoryStore.users.get(userId) || { createdAt: new Date().toISOString() };
  const merged = { ...existing, ...payload };
  inMemoryStore.users.set(userId, merged);
  return merged;
}

export async function getUser(userId) {
  const db = getFirestoreDb();
  if (isFirebaseConfigured() && db) {
    const doc = await db.collection('users').doc(userId).get();
    return doc.exists ? doc.data() : null;
  }

  return inMemoryStore.users.get(userId) || null;
}

/**
 * SEARCH HISTORY SERVICE
 */
export async function saveSearchHistory(userId, searchData) {
  const record = {
    userId: userId || 'anonymous',
    rawQuery: searchData.rawQuery || searchData.query || '',
    query: searchData.resolvedName || searchData.query || searchData.location || '',
    resolvedName: searchData.resolvedName || searchData.query || '',
    location: searchData.location || searchData.resolvedName || searchData.query || '',
    latitude: searchData.latitude ?? null,
    longitude: searchData.longitude ?? null,
    country: searchData.country || '',
    state: searchData.state || searchData.region || '',
    searchedAt: new Date().toISOString()
  };

  const db = getFirestoreDb();
  if (isFirebaseConfigured() && db) {
    const docRef = await db.collection('searchHistory').add(record);
    return { id: docRef.id, ...record };
  }

  const id = `sh-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
  const saved = { id, ...record };
  inMemoryStore.searchHistory.unshift(saved);
  return saved;
}

export async function getSearchHistory(userId, limit = 10) {
  const db = getFirestoreDb();
  if (isFirebaseConfigured() && db) {
    try {
      const snapshot = await db.collection('searchHistory')
        .where('userId', '==', userId)
        .get();
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      docs.sort((a, b) => new Date(b.searchedAt || b.createdAt || 0) - new Date(a.searchedAt || a.createdAt || 0));
      return docs.slice(0, limit);
    } catch (err) {
      console.warn('Firestore getSearchHistory error:', err.message);
    }
  }

  return inMemoryStore.searchHistory
    .filter(item => item.userId === userId)
    .slice(0, limit);
}

/**
 * CHAT HISTORY SERVICE
 */
export async function saveChatMessage(userId, chatData) {
  const record = {
    userId: userId || 'anonymous',
    sessionId: chatData.sessionId || `session-${Date.now()}`,
    message: chatData.message || '',
    response: chatData.response || '',
    intent: chatData.intent || 'GENERAL',
    location: chatData.location || '',
    createdAt: new Date().toISOString()
  };

  const db = getFirestoreDb();
  if (isFirebaseConfigured() && db) {
    const docRef = await db.collection('chatHistory').add(record);
    return { id: docRef.id, ...record };
  }

  const id = `chat-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
  const saved = { id, ...record };
  inMemoryStore.chatHistory.unshift(saved);
  return saved;
}

export async function getChatHistory(userId, limit = 20) {
  const db = getFirestoreDb();
  if (isFirebaseConfigured() && db) {
    try {
      const snapshot = await db.collection('chatHistory')
        .where('userId', '==', userId)
        .get();
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      docs.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      return docs.slice(0, limit);
    } catch (err) {
      console.warn('Firestore getChatHistory error:', err.message);
    }
  }

  return inMemoryStore.chatHistory
    .filter(item => item.userId === userId)
    .slice(0, limit);
}

/**
 * SAVED LOCATIONS SERVICE
 */
export async function saveLocation(userId, locationData) {
  const record = {
    userId: userId || 'anonymous',
    name: locationData.name || '',
    city: locationData.city || locationData.name || '',
    country: locationData.country || '',
    latitude: locationData.latitude ?? locationData.lat ?? 0,
    longitude: locationData.longitude ?? locationData.lon ?? 0,
    createdAt: new Date().toISOString()
  };

  const db = getFirestoreDb();
  if (isFirebaseConfigured() && db) {
    const docRef = await db.collection('savedLocations').add(record);
    return { id: docRef.id, ...record };
  }

  const userLocations = inMemoryStore.savedLocations.get(userId) || [];
  const id = `loc-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
  const saved = { id, ...record };
  userLocations.push(saved);
  inMemoryStore.savedLocations.set(userId, userLocations);
  return saved;
}

export async function removeSavedLocation(userId, locationId) {
  const db = getFirestoreDb();
  if (isFirebaseConfigured() && db) {
    await db.collection('savedLocations').doc(locationId).delete();
    return { success: true, id: locationId };
  }

  const userLocations = inMemoryStore.savedLocations.get(userId) || [];
  const filtered = userLocations.filter(loc => loc.id !== locationId);
  inMemoryStore.savedLocations.set(userId, filtered);
  return { success: true, id: locationId };
}

export async function getSavedLocations(userId) {
  const db = getFirestoreDb();
  if (isFirebaseConfigured() && db) {
    const snapshot = await db.collection('savedLocations')
      .where('userId', '==', userId)
      .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  return inMemoryStore.savedLocations.get(userId) || [];
}

/**
 * ALERT PREFERENCES SERVICE
 */
export async function saveAlertPreferences(userId, preferencesData) {
  const record = {
    userId: userId || 'anonymous',
    preferences: preferencesData.preferences || {},
    notificationFrequency: preferencesData.notificationFrequency || 'immediate',
    updatedAt: new Date().toISOString()
  };

  const db = getFirestoreDb();
  if (isFirebaseConfigured() && db) {
    await db.collection('alertPreferences').doc(userId).set(record, { merge: true });
    return record;
  }

  inMemoryStore.alertPreferences.set(userId, record);
  return record;
}

export async function getAlertPreferences(userId) {
  const db = getFirestoreDb();
  if (isFirebaseConfigured() && db) {
    const doc = await db.collection('alertPreferences').doc(userId).get();
    return doc.exists ? doc.data() : null;
  }

  return inMemoryStore.alertPreferences.get(userId) || null;
}

export default {
  createOrUpdateUser,
  getUser,
  saveSearchHistory,
  getSearchHistory,
  saveChatMessage,
  getChatHistory,
  saveLocation,
  removeSavedLocation,
  getSavedLocations,
  saveAlertPreferences,
  getAlertPreferences
};
