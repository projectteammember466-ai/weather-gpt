import { successResponse, errorResponse } from '../utils/response.utils.js';
import firestoreService from '../services/firestore.service.js';

export async function getSearchHistory(req, res, next) {
  try {
    const userId = req.query.userId || req.params.userId || 'anonymous';
    const limit = parseInt(req.query.limit || '10', 10);
    const history = await firestoreService.getSearchHistory(userId, limit);
    return successResponse(res, history);
  } catch (err) {
    next(err);
  }
}

export async function addSearchHistory(req, res, next) {
  try {
    const { 
      userId, 
      query, 
      rawQuery, 
      location, 
      resolvedName, 
      displayName, 
      latitude, 
      longitude, 
      country, 
      state, 
      source, 
      isCurrentLocation, 
      weatherSnapshot 
    } = req.body;
    const targetUserId = userId || 'anonymous';
    const searchQuery = query || rawQuery;

    if (!searchQuery) {
      return errorResponse(res, 'VALIDATION_ERROR', 'Search query parameter is required', 400);
    }

    const result = await firestoreService.saveSearchHistory(targetUserId, {
      query: searchQuery,
      rawQuery: searchQuery,
      location: location || resolvedName || displayName || searchQuery,
      resolvedName: resolvedName || location || searchQuery,
      displayName: displayName || resolvedName || location || searchQuery,
      latitude,
      longitude,
      country,
      state,
      source: source || 'open-meteo-geocoding',
      isCurrentLocation: Boolean(isCurrentLocation),
      weatherSnapshot: weatherSnapshot || null
    });

    return successResponse(res, result, 201);
  } catch (err) {
    next(err);
  }
}

export async function deleteSearchHistory(req, res, next) {
  try {
    const { searchId } = req.params;
    const userId = req.query.userId || req.body?.userId || 'anonymous';
    const result = await firestoreService.deleteSearchHistory(userId, searchId);
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
}

export async function getChatHistory(req, res, next) {
  try {
    const userId = req.query.userId || req.params.userId || 'anonymous';
    const limit = parseInt(req.query.limit || '20', 10);
    const history = await firestoreService.getChatHistory(userId, limit);
    return successResponse(res, history);
  } catch (err) {
    next(err);
  }
}

export async function addChatHistory(req, res, next) {
  try {
    const { userId, sessionId, message, response, intent, location } = req.body;
    const targetUserId = userId || 'anonymous';

    if (!message || !response) {
      return errorResponse(res, 'VALIDATION_ERROR', 'Message and response parameters are required', 400);
    }

    const result = await firestoreService.saveChatMessage(targetUserId, {
      sessionId,
      message,
      response,
      intent,
      location
    });

    return successResponse(res, result, 201);
  } catch (err) {
    next(err);
  }
}

export default {
  getSearchHistory,
  addSearchHistory,
  deleteSearchHistory,
  getChatHistory,
  addChatHistory
};
