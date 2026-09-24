/**
 * Standard API Response Format Utilities
 */

export function successResponse(res, data, statusCode = 200, extraMeta = {}) {
  return res.status(statusCode).json({
    success: true,
    data,
    ...extraMeta
  });
}

export function errorResponse(res, code, message, statusCode = 400, details = null) {
  const payload = {
    success: false,
    error: {
      code: code || 'BAD_REQUEST',
      message: message || 'An unexpected error occurred.'
    }
  };

  if (details && process.env.NODE_ENV !== 'production') {
    payload.error.details = details;
  }

  return res.status(statusCode).json(payload);
}
