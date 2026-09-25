import { successResponse } from '../utils/response.utils.js';
import firestoreService from '../services/firestore.service.js';
import { getFirestoreDb, isFirebaseConfigured } from '../config/firebase.js';

// In-memory store fallback for dashboard preferences
const inMemoryDashboardPrefs = new Map();

export async function updateProfile(req, res, next) {
  try {
    const { userId, ...userData } = req.body;
    const targetUserId = userId || req.query.userId || req.params.userId || 'anonymous';
    const user = await firestoreService.createOrUpdateUser(targetUserId, userData);
    return successResponse(res, user);
  } catch (err) {
    next(err);
  }
}

export async function getProfile(req, res, next) {
  try {
    const targetUserId = req.params.userId || req.query.userId || 'anonymous';
    const user = await firestoreService.getUser(targetUserId);
    return successResponse(res, user || {});
  } catch (err) {
    next(err);
  }
}

export async function getSettings(req, res, next) {
  try {
    const userId = req.query.userId || req.params.userId || 'anonymous';
    const user = await firestoreService.getUser(userId);
    const alertPrefs = await firestoreService.getAlertPreferences(userId);

    const settings = {
      userId,
      language: user?.language || 'en',
      temperatureUnit: user?.temperatureUnit || 'celsius',
      theme: user?.theme || 'dark',
      contextMode: user?.contextMode || 'general',
      alertPreferences: alertPrefs || { rainAlerts: true, severeStorms: true },
      updatedAt: user?.updatedAt || new Date().toISOString()
    };

    return successResponse(res, settings);
  } catch (err) {
    next(err);
  }
}

export async function updateSettings(req, res, next) {
  try {
    const { userId, language, temperatureUnit, theme, contextMode, alertPreferences, ...other } = req.body;
    const targetUserId = userId || req.query.userId || 'anonymous';

    const userPayload = {
      language,
      temperatureUnit,
      theme,
      contextMode,
      ...other
    };

    const updatedUser = await firestoreService.createOrUpdateUser(targetUserId, userPayload);

    if (alertPreferences) {
      await firestoreService.saveAlertPreferences(targetUserId, alertPreferences);
    }

    return successResponse(res, {
      userId: targetUserId,
      ...updatedUser,
      alertPreferences: alertPreferences || {}
    });
  } catch (err) {
    next(err);
  }
}

export async function getDashboardPreferences(req, res, next) {
  try {
    const userId = req.query.userId || req.params.userId || 'anonymous';
    const db = getFirestoreDb();

    if (isFirebaseConfigured() && db) {
      const doc = await db.collection('dashboardPreferences').doc(userId).get();
      if (doc.exists) {
        return successResponse(res, doc.data());
      }
    }

    const fallback = inMemoryDashboardPrefs.get(userId) || {
      userId,
      visibleSections: ['hero', 'details', 'hourly', 'daily', 'guidance', 'astronomy', 'map', 'climate'],
      sectionOrder: ['hero', 'details', 'hourly', 'daily', 'guidance', 'astronomy', 'map', 'climate'],
      updatedAt: new Date().toISOString()
    };

    return successResponse(res, fallback);
  } catch (err) {
    next(err);
  }
}

export async function updateDashboardPreferences(req, res, next) {
  try {
    const { userId, visibleSections, sectionOrder } = req.body;
    const targetUserId = userId || req.query.userId || 'anonymous';

    const payload = {
      userId: targetUserId,
      visibleSections: visibleSections || ['hero', 'details', 'hourly', 'daily', 'guidance', 'astronomy', 'map', 'climate'],
      sectionOrder: sectionOrder || ['hero', 'details', 'hourly', 'daily', 'guidance', 'astronomy', 'map', 'climate'],
      updatedAt: new Date().toISOString()
    };

    const db = getFirestoreDb();
    if (isFirebaseConfigured() && db) {
      await db.collection('dashboardPreferences').doc(targetUserId).set(payload, { merge: true });
    } else {
      inMemoryDashboardPrefs.set(targetUserId, payload);
    }

    return successResponse(res, payload);
  } catch (err) {
    next(err);
  }
}

export async function addSearchHistory(req, res, next) {
  try {
    const { userId, ...searchData } = req.body;
    const result = await firestoreService.saveSearchHistory(userId, searchData);
    return successResponse(res, result, 201);
  } catch (err) {
    next(err);
  }
}

export async function fetchSearchHistory(req, res, next) {
  try {
    const { userId } = req.params;
    const limit = parseInt(req.query.limit || '10', 10);
    const history = await firestoreService.getSearchHistory(userId, limit);
    return successResponse(res, history);
  } catch (err) {
    next(err);
  }
}

export async function addSavedLocation(req, res, next) {
  try {
    const { userId, ...locationData } = req.body;
    const result = await firestoreService.saveLocation(userId, locationData);
    return successResponse(res, result, 201);
  } catch (err) {
    next(err);
  }
}

export async function removeSavedLocation(req, res, next) {
  try {
    const { userId, locationId } = req.params;
    const result = await firestoreService.removeSavedLocation(userId, locationId);
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
}

export async function fetchSavedLocations(req, res, next) {
  try {
    const { userId } = req.params;
    const locations = await firestoreService.getSavedLocations(userId);
    return successResponse(res, locations);
  } catch (err) {
    next(err);
  }
}

export async function saveAlertPreferences(req, res, next) {
  try {
    const { userId, ...preferences } = req.body;
    const result = await firestoreService.saveAlertPreferences(userId, preferences);
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
}

export async function fetchAlertPreferences(req, res, next) {
  try {
    const { userId } = req.params;
    const preferences = await firestoreService.getAlertPreferences(userId);
    return successResponse(res, preferences || {});
  } catch (err) {
    next(err);
  }
}

export default {
  updateProfile,
  getProfile,
  getSettings,
  updateSettings,
  getDashboardPreferences,
  updateDashboardPreferences,
  addSearchHistory,
  fetchSearchHistory,
  addSavedLocation,
  removeSavedLocation,
  fetchSavedLocations,
  saveAlertPreferences,
  fetchAlertPreferences
};
