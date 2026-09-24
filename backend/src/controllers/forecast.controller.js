import { successResponse } from '../utils/response.utils.js';
import { getForecast } from '../services/forecast.service.js';

export async function getForecastData(req, res, next) {
  try {
    const { lat, lon } = req.validatedCoords;
    const { days } = req.query;

    const forecastData = await getForecast(lat, lon, days);
    return successResponse(res, forecastData);
  } catch (err) {
    next(err);
  }
}

export default {
  getForecastData
};
