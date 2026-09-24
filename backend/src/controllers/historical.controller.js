import { successResponse } from '../utils/response.utils.js';
import { getHistoricalWeather } from '../services/historical.service.js';

export async function getHistoricalData(req, res, next) {
  try {
    const { lat, lon } = req.validatedCoords;
    const { startDate, endDate, locationName } = req.query;

    const historicalData = await getHistoricalWeather(lat, lon, startDate, endDate, locationName);
    return successResponse(res, historicalData);
  } catch (err) {
    next(err);
  }
}

export default {
  getHistoricalData
};
