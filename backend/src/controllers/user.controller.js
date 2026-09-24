import { successResponse } from '../utils/response.utils.js';
import firestoreService from '../services/firestore.service.js';

export async function updateProfile(req, res, next) {
  try {
    const { userId, ...userData } = req.body;
    const targetUserId = userId || req.params.userId || 'anonymous';
    const user = await firestoreService.createOrUpdateUser(targetUserId, userData);
    return successResponse(res, user);
  } catch (err) {
    next(err);
  }
}

export async function getProfile(req, res, next) {
  try {
    const { userId } = req.params;
    const user = await firestoreService.getUser(userId);
    return successResponse(res, user || {});
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
  addSearchHistory,
  fetchSearchHistory,
  addSavedLocation,
  removeSavedLocation,
  fetchSavedLocations,
  saveAlertPreferences,
  fetchAlertPreferences
};
