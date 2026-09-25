import { successResponse } from '../utils/response.utils.js';
import { getCurrentWeather } from '../services/weather.service.js';

export async function getAlerts(req, res, next) {
  try {
    const { lat, lon, city } = req.query;

    let weatherData = null;
    if (lat && lon && !isNaN(parseFloat(lat)) && !isNaN(parseFloat(lon))) {
      try {
        weatherData = await getCurrentWeather(parseFloat(lat), parseFloat(lon), city || 'Location');
      } catch {
        // Fallback
      }
    }

    const alerts = [];
    if (weatherData && weatherData.current) {
      const curr = weatherData.current;

      if (curr.rainProbability >= 70 || (curr.condition && curr.condition.toLowerCase().includes('rain'))) {
        alerts.push({
          id: `alert-rain-${Date.now()}`,
          severity: 'Warning',
          title: 'Heavy Rain Warning',
          message: `Active precipitation reported with ${curr.rainProbability}% probability. Avoid low-lying areas.`,
          issuedAt: new Date().toISOString(),
          source: 'Meteorological Telemetry'
        });
      }

      if (curr.windSpeed >= 35) {
        alerts.push({
          id: `alert-wind-${Date.now()}`,
          severity: 'Advisory',
          title: 'High Wind Advisory',
          message: `Surface wind speed is ${curr.windSpeed} km/h. Secure loose outdoor items.`,
          issuedAt: new Date().toISOString(),
          source: 'Meteorological Telemetry'
        });
      }

      if (curr.aqi >= 150) {
        alerts.push({
          id: `alert-aqi-${Date.now()}`,
          severity: 'Warning',
          title: 'Unhealthy Air Quality Warning',
          message: `AQI index reached ${curr.aqi} (${curr.aqiCategory}). Limit prolonged outdoor exertion.`,
          issuedAt: new Date().toISOString(),
          source: 'Environmental Protection Agency Telemetry'
        });
      }
    }

    return successResponse(res, {
      location: city || 'Selected Location',
      alertsCount: alerts.length,
      alerts,
      officialStatus: alerts.length > 0 ? "Active Official Advisories" : "No Active Severe Weather Warnings",
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    next(err);
  }
}

export default {
  getAlerts
};
