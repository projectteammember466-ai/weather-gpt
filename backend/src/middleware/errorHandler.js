import { errorResponse } from '../utils/response.utils.js';
import logger from '../utils/logger.utils.js';

export class AppError extends Error {
  constructor(message, statusCode = 500, errorCode = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message) {
    super(message, 400, 'VALIDATION_ERROR');
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
  }
}

export class ProviderError extends AppError {
  constructor(message = 'Upstream provider error') {
    super(message, 502, 'WEATHER_PROVIDER_ERROR');
  }
}

// Central Express Error Handler
export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const errorCode = err.errorCode || 'INTERNAL_SERVER_ERROR';
  const message = err.message || 'An unexpected error occurred.';

  logger.error(`${errorCode} (${statusCode}): ${message}`);

  // Never leak internal stack traces to clients
  return errorResponse(res, errorCode, message, statusCode);
}

// 404 Not Found Middleware for unknown routes
export function notFoundHandler(req, res, next) {
  return errorResponse(res, 'NOT_FOUND', `Cannot ${req.method} ${req.originalUrl}`, 404);
}
