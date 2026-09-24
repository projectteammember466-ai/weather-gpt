import { successResponse } from '../utils/response.utils.js';
import { getCurrentWeather } from '../services/weather.service.js';

export async function getWeather(req, res, next) {
  try {
    const { lat, lon } = req.validatedCoords;
    const { locationName } = req.query;

    const weatherData = await getCurrentWeather(lat, lon, locationName);
    return successResponse(res, weatherData);
  } catch (err) {
    next(err);
  }
}

export default {
  getWeather
};
