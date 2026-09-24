import { successResponse } from '../utils/response.utils.js';
import { isFirebaseConfigured } from '../config/firebase.js';
import config from '../config/env.js';

export function getHealthStatus(req, res, next) {
  try {
    const healthData = {
      service: "WeatherGPT Backend",
      status: "healthy",
      timestamp: new Date().toISOString(),
      environment: config.nodeEnv,
      version: "1.0.0",
      firebase: {
        configured: isFirebaseConfigured(),
        status: isFirebaseConfigured() ? "connected" : "unconfigured"
      }
    };

    return successResponse(res, healthData);
  } catch (err) {
    next(err);
  }
}

export default {
  getHealthStatus
};
