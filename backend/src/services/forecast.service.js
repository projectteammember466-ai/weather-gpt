import { ProviderError } from '../middleware/errorHandler.js';
import { parseWmoCode } from './weather.service.js';

export async function getForecast(lat, lon, days = 7) {
  try {
    const numDays = Math.min(Math.max(parseInt(days, 10) || 7, 1), 16);

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max,sunrise,sunset&forecast_days=${numDays}&timezone=auto`;

    const res = await fetch(url, { signal: AbortSignal.timeout ? AbortSignal.timeout(5000) : undefined });
    if (!res.ok) {
      throw new ProviderError(`Open-Meteo returned HTTP status ${res.status}`);
    }

    const data = await res.json();
    const dailyData = data.daily || {};
    const hourlyData = data.hourly || {};

    const daily = [];
    if (Array.isArray(dailyData.time)) {
      for (let i = 0; i < dailyData.time.length; i++) {
        const code = dailyData.weather_code?.[i] ?? 0;
        const parsed = parseWmoCode(code);
        daily.push({
          date: dailyData.time[i],
          maxTemp: Math.round(dailyData.temperature_2m_max?.[i] ?? 30),
          minTemp: Math.round(dailyData.temperature_2m_min?.[i] ?? 20),
          condition: parsed.condition,
          icon: parsed.icon,
          rainProbability: Math.round(dailyData.precipitation_probability_max?.[i] ?? 10),
          uvIndexMax: Math.round(dailyData.uv_index_max?.[i] ?? 6),
          sunrise: dailyData.sunrise?.[i] ? dailyData.sunrise[i].split('T')[1] : "06:15",
          sunset: dailyData.sunset?.[i] ? dailyData.sunset[i].split('T')[1] : "18:45"
        });
      }
    }

    const hourly = [];
    if (Array.isArray(hourlyData.time)) {
      // First 24 hours
      const count = Math.min(24, hourlyData.time.length);
      for (let i = 0; i < count; i++) {
        const code = hourlyData.weather_code?.[i] ?? 0;
        const parsed = parseWmoCode(code);
        const timeStr = hourlyData.time[i].split('T')[1] || hourlyData.time[i];
        hourly.push({
          time: timeStr.slice(0, 5),
          temperature: Math.round(hourlyData.temperature_2m?.[i] ?? 25),
          humidity: Math.round(hourlyData.relative_humidity_2m?.[i] ?? 50),
          rainProbability: Math.round(hourlyData.precipitation_probability?.[i] ?? 10),
          windSpeed: Math.round(hourlyData.wind_speed_10m?.[i] ?? 10),
          condition: parsed.condition,
          icon: parsed.icon
        });
      }
    }

    return {
      location: {
        latitude: lat,
        longitude: lon
      },
      forecastDays: daily.length,
      daily,
      hourly,
      metadata: {
        source: "Open-Meteo Forecast API",
        timestamp: new Date().toISOString()
      }
    };
  } catch (err) {
    if (err instanceof ProviderError) throw err;
    throw new ProviderError(`Unable to retrieve forecast data: ${err.message}`);
  }
}

export default {
  getForecast
};
