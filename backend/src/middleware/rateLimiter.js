import { errorResponse } from '../utils/response.utils.js';
import config from '../config/env.js';

// In-memory request tracker for IP rate limiting
const ipRequestMap = new Map();

// Cleanup expired windows every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of ipRequestMap.entries()) {
    if (now > record.resetTime) {
      ipRequestMap.delete(ip);
    }
  }
}, 5 * 60 * 1000).unref();

export function createRateLimiter({ windowMs = 60 * 1000, max = 100, message = 'Too many requests. Please slow down.' } = {}) {
  return (req, res, next) => {
    // Disable or relax rate limiting in test environment
    if (config.nodeEnv === 'test') {
      return next();
    }

    const clientIp = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const now = Date.now();

    let record = ipRequestMap.get(clientIp);
    if (!record || now > record.resetTime) {
      record = {
        count: 0,
        resetTime: now + windowMs
      };
      ipRequestMap.set(clientIp, record);
    }

    record.count++;

    if (record.count > max) {
      res.setHeader('Retry-After', Math.ceil((record.resetTime - now) / 1000));
      return errorResponse(res, 'TOO_MANY_REQUESTS', message, 429);
    }

    next();
  };
}

export const chatRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 60,
  message: 'AI Chat request limit exceeded. Please wait a moment.'
});

export const apiRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 120,
  message: 'API request limit exceeded.'
});

export default {
  createRateLimiter,
  chatRateLimiter,
  apiRateLimiter
};
