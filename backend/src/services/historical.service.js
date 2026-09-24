import { ProviderError } from '../middleware/errorHandler.js';
import { parseWmoCode } from './weather.service.js';

export async function getHistoricalWeather(lat, lon, startDate, endDate, locationName = 'Selected Location') {
  // Default to past 7 days if not provided
  if (!startDate || !endDate) {
    const end = new Date();
    end.setDate(end.getDate() - 2); // Archive data available up to 2 days ago
    const start = new Date(end);
    start.setDate(start.getDate() - 7);
    startDate = start.toISOString().split('T')[0];
    endDate = end.toISOString().split('T')[0];
  }

  try {
    const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${startDate}&end_date=${endDate}&daily=weather_code,temperature_2m_max,temperature_2m_min,temperature_2m_mean,precipitation_sum,rain_sum,wind_speed_10m_max&timezone=auto`;

    const res = await fetch(url, { signal: AbortSignal.timeout ? AbortSignal.timeout(6000) : undefined });
    if (!res.ok) {
      throw new ProviderError(`Open-Meteo Archive API returned status ${res.status}`);
    }

    const data = await res.json();
    const dailyData = data.daily || {};

    const days = [];
    if (Array.isArray(dailyData.time)) {
      for (let i = 0; i < dailyData.time.length; i++) {
        const code = dailyData.weather_code?.[i] ?? 0;
        const parsed = parseWmoCode(code);
        const maxT = dailyData.temperature_2m_max?.[i] ?? 30;
        const minT = dailyData.temperature_2m_min?.[i] ?? 20;
        const meanT = dailyData.temperature_2m_mean?.[i] ?? Math.round((maxT + minT) / 2);
        const precip = dailyData.precipitation_sum?.[i] ?? 0;
        const wind = dailyData.wind_speed_10m_max?.[i] ?? 12;

        days.push({
          date: dailyData.time[i],
          weatherCode: code,
          condition: parsed.condition,
          icon: parsed.icon,
          maxTemp: Math.round(maxT),
          minTemp: Math.round(minT),
          meanTemp: Math.round(meanT),
          precipitation: Math.round(precip * 10) / 10,
          windSpeed: Math.round(wind)
        });
      }
    }

    const allMaxTemps = days.map(d => d.maxTemp);
    const allMinTemps = days.map(d => d.minTemp);
    const allMeanTemps = days.map(d => d.meanTemp);
    const allPrecip = days.map(d => d.precipitation);
    const allWind = days.map(d => d.windSpeed);

    const summary = {
      avgTemp: days.length > 0 ? Math.round(allMeanTemps.reduce((a, b) => a + b, 0) / days.length) : 0,
      maxTemp: days.length > 0 ? Math.max(...allMaxTemps) : 0,
      minTemp: days.length > 0 ? Math.min(...allMinTemps) : 0,
      totalPrecipitation: days.length > 0 ? Math.round(allPrecip.reduce((a, b) => a + b, 0) * 10) / 10 : 0,
      rainyDays: days.filter(d => d.precipitation > 0.1).length,
      maxWindSpeed: days.length > 0 ? Math.max(...allWind) : 0
    };

    return {
      location: {
        name: locationName,
        latitude: lat,
        longitude: lon
      },
      startDate,
      endDate,
      daysCount: days.length,
      daily: days,
      summary,
      metadata: {
        source: "Open-Meteo Historical Archive API (ERA5 Reanalysis)",
        timestamp: new Date().toISOString()
      }
    };
  } catch (err) {
    if (err instanceof ProviderError) throw err;
    throw new ProviderError(`Unable to retrieve historical climate data: ${err.message}`);
  }
}

export default {
  getHistoricalWeather
};
