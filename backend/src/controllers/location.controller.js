import { successResponse, errorResponse } from '../utils/response.utils.js';
import { searchLocations } from '../services/location.service.js';
import firestoreService from '../services/firestore.service.js';

export async function search(req, res, next) {
  try {
    const query = req.validatedQuery;
    const locations = await searchLocations(query);
    return successResponse(res, locations);
  } catch (err) {
    next(err);
  }
}

export async function getSavedLocations(req, res, next) {
  try {
    const userId = req.query.userId || req.params.userId || 'anonymous';
    const locations = await firestoreService.getSavedLocations(userId);
    return successResponse(res, locations);
  } catch (err) {
    next(err);
  }
}

export async function addSavedLocation(req, res, next) {
  try {
    const { userId, name, city, country, latitude, longitude, lat, lon } = req.body;
    const targetUserId = userId || 'anonymous';
    const locName = name || city;

    if (!locName) {
      return errorResponse(res, 'VALIDATION_ERROR', 'Location name or city is required', 400);
    }

    const locationData = {
      name: locName,
      city: city || locName,
      country: country || '',
      latitude: latitude ?? lat ?? 0,
      longitude: longitude ?? lon ?? 0
    };

    const result = await firestoreService.saveLocation(targetUserId, locationData);
    return successResponse(res, result, 201);
  } catch (err) {
    next(err);
  }
}

export async function deleteSavedLocation(req, res, next) {
  try {
    const userId = req.query.userId || req.params.userId || 'anonymous';
    const id = req.params.id || req.params.locationId;

    if (!id) {
      return errorResponse(res, 'VALIDATION_ERROR', 'Location ID is required', 400);
    }

    const result = await firestoreService.removeSavedLocation(userId, id);
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
}

export default {
  search,
  getSavedLocations,
  addSavedLocation,
  deleteSavedLocation
};
