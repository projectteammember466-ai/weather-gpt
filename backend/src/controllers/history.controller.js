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
    const { userId, query, location, latitude, longitude } = req.body;
    const targetUserId = userId || 'anonymous';

    if (!query) {
      return errorResponse(res, 'VALIDATION_ERROR', 'Search query parameter is required', 400);
    }

    const result = await firestoreService.saveSearchHistory(targetUserId, {
      query,
      location: location || query,
      latitude,
      longitude
    });

    return successResponse(res, result, 201);
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
  getChatHistory,
  addChatHistory
};
