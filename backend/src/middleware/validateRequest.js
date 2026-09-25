import { ValidationError } from './errorHandler.js';

/**
 * Validate latitude and longitude parameters
 */
export function validateCoordinates(req, res, next) {
  const { lat, lon } = req.query;

  if (lat === undefined || lon === undefined) {
    return next(new ValidationError('Latitude (lat) and longitude (lon) query parameters are required.'));
  }

  const latitude = parseFloat(lat);
  const longitude = parseFloat(lon);

  if (isNaN(latitude) || latitude < -90 || latitude > 90) {
    return next(new ValidationError('Latitude must be a valid number between -90 and 90.'));
  }

  if (isNaN(longitude) || longitude < -180 || longitude > 180) {
    return next(new ValidationError('Longitude must be a valid number between -180 and 180.'));
  }

  req.validatedCoords = { lat: latitude, lon: longitude };
  next();
}

/**
 * Validate location search query string
 */
export function validateLocationQuery(req, res, next) {
  const { q } = req.query;

  if (!q || typeof q !== 'string' || q.trim().length === 0) {
    return next(new ValidationError('Search query parameter (q) is required and cannot be empty.'));
  }

  if (q.trim().length > 100) {
    return next(new ValidationError('Search query is too long (maximum 100 characters allowed).'));
  }

  req.validatedQuery = q.trim();
  next();
}

/**
 * Validate date range for historical query (YYYY-MM-DD)
 */
export function validateDateRange(req, res, next) {
  const { startDate, endDate } = req.query;

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (startDate && !dateRegex.test(startDate)) {
    return next(new ValidationError('startDate must be in YYYY-MM-DD format.'));
  }

  if (endDate && !dateRegex.test(endDate)) {
    return next(new ValidationError('endDate must be in YYYY-MM-DD format.'));
  }

  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return next(new ValidationError('Invalid date values provided.'));
    }

    if (end < start) {
      return next(new ValidationError('endDate cannot be earlier than startDate.'));
    }
  }

  next();
}

/**
 * Validate chat request payload
 */
export function validateChatPayload(req, res, next) {
  const { message } = req.body || {};

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return next(new ValidationError('Message body parameter is required and cannot be empty.'));
  }

  if (message.trim().length > 1000) {
    return next(new ValidationError('Message payload is too long (maximum 1000 characters allowed).'));
  }

  next();
}
