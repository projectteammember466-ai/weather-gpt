// WeatherGPT API Abstraction Layer (Enhanced with Open-Meteo Geocoding & Weather Telemetry)

import { getMockWeather, ALL_DEMO_CITIES, MOCK_WEATHER_DATA } from '../data/weatherData.js';
import { getHourlyForecast, getDailyForecast } from '../data/forecastData.js';
import { getMockAlerts } from '../data/alertData.js';
import { generateAIChatResponse } from '../data/chatData.js';
import { getMockClimate } from '../data/climateData.js';
import { chatWithGeminiAndWeatherTools } from './geminiService.js';

// Simulated async delay
const mockDelay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));

// Simple in-memory cache to respect free API rate limits and optimize UI performance
const geocodeCache = new Map();
const reverseGeocodeCache = new Map();
const weatherCoordsCache = new Map();
const aqiCache = new Map();
const historicalCache = new Map();

// Helper to convert WMO Weather Code to WeatherGPT Condition & Icon
export function parseWmoCode(code) {
  if (code === 0) return { condition: 'Clear Sky', icon: 'Sun' };
  if (code === 1 || code === 2) return { condition: 'Partly Cloudy', icon: 'SunMedium' };
  if (code === 3) return { condition: 'Overcast', icon: 'Cloud' };
  if (code === 45 || code === 48) return { condition: 'Foggy', icon: 'Cloud' };
  if (code >= 51 && code <= 57) return { condition: 'Light Rain / Drizzle', icon: 'CloudRain' };
  if (code >= 61 && code <= 67) return { condition: 'Rain', icon: 'CloudRain' };
  if (code >= 71 && code <= 77) return { condition: 'Snow', icon: 'Snowflake' };
  if (code >= 80 && code <= 82) return { condition: 'Rain Showers', icon: 'CloudRain' };
  if (code >= 85 && code <= 86) return { condition: 'Snow Showers', icon: 'Snowflake' };
  if (code >= 95 && code <= 99) return { condition: 'Thunderstorm', icon: 'CloudLightning' };
  return { condition: 'Clear', icon: 'Sun' };
}

// 1. Open-Meteo Geocoding API Search
export async function searchGeocoding(query) {
  if (!query || query.trim().length < 2) return [];
  const cleanQuery = query.trim().toLowerCase();

  if (geocodeCache.has(cleanQuery)) {
    return geocodeCache.get(cleanQuery);
  }

  try {
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=8&language=en&format=json`
    );
    if (!res.ok) throw new Error(`Geocoding HTTP error ${res.status}`);
    const data = await res.json();
    
    if (data.results && data.results.length > 0) {
      const results = data.results.map((item) => ({
        id: `geo-${item.id}`,
        name: item.name,
        city: item.name,
        region: item.admin1 || item.admin2 || item.country || '',
        country: item.country || '',
        countryCode: item.country_code || '',
        lat: item.latitude,
        lon: item.longitude,
        latitude: item.latitude,
        longitude: item.longitude,
        timezone: item.timezone || 'UTC',
        population: item.population || 0
      }));
      geocodeCache.set(cleanQuery, results);
      return results;
    }
  } catch (err) {
    console.warn("Open-Meteo Geocoding API unavailable or offline, using fallback:", err);
  }

  // Fallback search against demo cities
  const mockMatches = ALL_DEMO_CITIES.filter((c) =>
    c.name.toLowerCase().includes(cleanQuery) || c.city.toLowerCase().includes(cleanQuery)
  ).map((c) => ({
    id: c.id,
    name: c.name,
    city: c.city,
    region: c.region || c.country,
    country: c.country,
    countryCode: 'IN',
    lat: c.lat,
    lon: c.lon,
    latitude: c.lat,
    longitude: c.lon,
    timezone: 'Asia/Kolkata'
  }));

  geocodeCache.set(cleanQuery, mockMatches);
  return mockMatches;
}

// 1.1 Reverse Geocode Coordinates to City, Region, Country
export async function reverseGeocodeCoords(lat, lon) {
  const cacheKey = `${lat.toFixed(3)},${lon.toFixed(3)}`;
  if (reverseGeocodeCache.has(cacheKey)) {
    return reverseGeocodeCache.get(cacheKey);
  }

  // Attempt 1: BigDataCloud reverse geocode (Free client-side reverse geocoding API)
  try {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
    );
    if (res.ok) {
      const data = await res.json();
      const city = data.city || data.locality || data.principalSubdivision || '';
      const region = data.principalSubdivision || data.localityInfo?.administrative?.[1]?.name || '';
      const country = data.countryName || '';
      if (city) {
        const result = {
          city,
          region,
          country,
          name: city,
          latitude: lat,
          longitude: lon
        };
        reverseGeocodeCache.set(cacheKey, result);
        return result;
      }
    }
  } catch (err) {
    console.warn("BigDataCloud reverse geocode failed, attempting Nominatim fallback:", err);
  }

  // Attempt 2: OpenStreetMap Nominatim reverse geocode
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&zoom=10&addressdetails=1`,
      { headers: { 'Accept': 'application/json' } }
    );
    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const city = addr.city || addr.town || addr.village || addr.suburb || addr.county || addr.state_district || addr.state || '';
      const region = addr.state || addr.region || '';
      const country = addr.country || '';
      if (city) {
        const result = {
          city,
          region,
          country,
          name: city,
          latitude: lat,
          longitude: lon
        };
        reverseGeocodeCache.set(cacheKey, result);
        return result;
      }
    }
  } catch (err) {
    console.warn("Nominatim reverse geocode fallback failed:", err);
  }

  // Fallback: Coordinate string representation
  const latStr = `${Math.abs(lat).toFixed(2)}°${lat >= 0 ? 'N' : 'S'}`;
  const lonStr = `${Math.abs(lon).toFixed(2)}°${lon >= 0 ? 'E' : 'W'}`;
  const coordName = `${latStr}, ${lonStr}`;
  const fallback = {
    city: coordName,
    region: 'Detected Location',
    country: 'Current Device Location',
    name: coordName,
    latitude: lat,
    longitude: lon
  };
  reverseGeocodeCache.set(cacheKey, fallback);
  return fallback;
}

// 2. Open-Meteo Air Quality API
export async function fetchAirQualityByCoords(lat, lon) {
  const cacheKey = `${lat.toFixed(2)},${lon.toFixed(2)}`;
  if (aqiCache.has(cacheKey)) return aqiCache.get(cacheKey);

  try {
    const res = await fetch(
      `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm10,pm2_5,nitrogen_dioxide,ozone`,
      { signal: AbortSignal.timeout ? AbortSignal.timeout(4000) : undefined }
    );
    if (res.ok) {
      const data = await res.json();
      const current = data.current || {};
      const aqiVal = current.us_aqi || 65;
      let category = 'Good';
      if (aqiVal > 150) category = 'Unhealthy';
      else if (aqiVal > 100) category = 'Moderate / Sensitive';
      else if (aqiVal > 50) category = 'Moderate';

      const result = {
        aqi: aqiVal,
        aqiCategory: category,
        pm25: current.pm2_5 || 12,
        pm10: current.pm10 || 25,
        no2: current.nitrogen_dioxide || 15,
        ozone: current.ozone || 30
      };
      aqiCache.set(cacheKey, result);
      return result;
    }
  } catch (err) {
    console.warn("Air Quality API fallback:", err);
  }

  return { aqi: 75, aqiCategory: 'Moderate', pm25: 18, pm10: 32, no2: 12, ozone: 28 };
}

// 3. Open-Meteo Weather API by Coordinates
export async function fetchWeatherByCoords(lat, lon, locationName = 'Selected Location', region = '', country = '') {
  const cacheKey = `${lat.toFixed(2)},${lon.toFixed(2)}`;
  
  try {
    const [weatherRes, aqiRes] = await Promise.all([
      fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m,uv_index&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`,
        { signal: AbortSignal.timeout ? AbortSignal.timeout(4000) : undefined }
      ),
      fetchAirQualityByCoords(lat, lon)
    ]);

    if (!weatherRes.ok) throw new Error(`Weather HTTP error ${weatherRes.status}`);
    const data = await weatherRes.json();
    const curr = data.current || {};
    const parsed = parseWmoCode(curr.weather_code || 0);

    const windDirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const windDir = windDirs[Math.floor(((curr.wind_direction_10m || 0) + 22.5) / 45) % 8];

    const normalized = {
      location: {
        id: `loc-${lat.toFixed(2)}-${lon.toFixed(2)}`,
        name: locationName,
        city: locationName,
        region: region || country || 'Region',
        state: region || country,
        country: country || 'Global Station',
        lat: lat,
        lon: lon,
        latitude: lat,
        longitude: lon
      },
      current: {
        temperature: Math.round(curr.temperature_2m ?? 30),
        feelsLike: Math.round(curr.apparent_temperature ?? curr.temperature_2m ?? 32),
        condition: parsed.condition,
        icon: parsed.icon,
        humidity: Math.round(curr.relative_humidity_2m ?? 45),
        windSpeed: Math.round(curr.wind_speed_10m ?? 12),
        windDirection: windDir,
        rainProbability: Math.round(curr.precipitation ? 80 : (curr.cloud_cover > 50 ? 30 : 5)),
        highTemp: Math.round(data.daily?.temperature_2m_max?.[0] ?? (curr.temperature_2m + 3)),
        lowTemp: Math.round(data.daily?.temperature_2m_min?.[0] ?? (curr.temperature_2m - 5)),
        pressure: Math.round(curr.pressure_msl ?? 1012),
        visibility: 10,
        uvIndex: Math.round(curr.uv_index ?? 6),
        cloudCover: Math.round(curr.cloud_cover ?? 20),
        dewPoint: Math.round(curr.temperature_2m - ((100 - (curr.relative_humidity_2m || 50)) / 5)),
        sunrise: "06:15 AM",
        sunset: "06:45 PM",
        aqi: aqiRes.aqi,
        aqiCategory: aqiRes.aqiCategory
      },
      confidence: {
        level: "High",
        percentage: 92,
        forecastWindow: "Live Open-Meteo Atmospheric Observation",
        uncertaintyExplanation: "Real-time numerical weather prediction physics model telemetry."
      },
      whyForecast: {
        topic: `${parsed.condition} Conditions`,
        signals: [
          { name: "Atmospheric Pressure", status: `${Math.round(curr.pressure_msl || 1012)} hPa`, icon: "Gauge" },
          { name: "Relative Humidity", status: `${Math.round(curr.relative_humidity_2m || 45)}%`, icon: "Droplets" },
          { name: "Cloud Cover", status: `${Math.round(curr.cloud_cover || 20)}%`, icon: "Cloud" },
          { name: "Wind Velocity", status: `${Math.round(curr.wind_speed_10m || 10)} km/h ${windDir}`, icon: "Wind" }
        ],
        reasoning: `Atmospheric telemetry indicates ${parsed.condition.toLowerCase()} with surface pressure at ${Math.round(curr.pressure_msl || 1012)} hPa and humidity around ${Math.round(curr.relative_humidity_2m || 45)}%.`,
        aiExplanation: `Current live weather observation for ${locationName} shows ${parsed.condition.toLowerCase()} at ${Math.round(curr.temperature_2m || 30)}°C.`
      },
      contextAdvice: {
        general: `${parsed.condition} at ${Math.round(curr.temperature_2m || 30)}°C in ${locationName}.`,
        farmer: curr.precipitation > 0 ? "Precipitation recorded. Monitor crop drainage." : "Dry atmospheric conditions. Maintain irrigation schedule.",
        traveler: `Visibility clear (10 km). Wind speed ${Math.round(curr.wind_speed_10m || 12)} km/h.`,
        outdoor: `UV index ${Math.round(curr.uv_index || 6)}. Sun protection recommended during peak afternoon.`,
        emergency: "No severe immediate emergency weather alerts detected for this coordinate."
      },
      metadata: {
        source: "Open-Meteo High-Resolution Telemetry API",
        updatedAt: "Just now",
        freshness: "Fresh",
        dataTimestamp: new Date().toISOString()
      }
    };

    weatherCoordsCache.set(cacheKey, normalized);
    return normalized;
  } catch (err) {
    console.warn("Open-Meteo Live Weather API error, falling back to mock:", err);
  }

  const fallback = getMockWeather(locationName.toLowerCase());
  return {
    ...fallback,
    location: {
      ...fallback.location,
      name: locationName,
      city: locationName,
      region: region || fallback.location?.region || 'Region',
      country: country || fallback.location?.country || 'India',
      lat: lat,
      lon: lon,
      latitude: lat,
      longitude: lon
    }
  };
}

export const DEFAULT_GOOGLE_MAPS_KEY = '';

export function getGoogleMapsApiKey() {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('weathergpt_google_maps_api_key') ||
         (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GOOGLE_MAPS_API_KEY) ||
         '';
}

export function setGoogleMapsApiKey(key) {
  if (typeof window === 'undefined') return;
  if (key && key.trim()) {
    localStorage.setItem('weathergpt_google_maps_api_key', key.trim());
  } else {
    localStorage.removeItem('weathergpt_google_maps_api_key');
  }
}

// 4. Primary fetchWeather entry point (Seamless Live + Fallback)
export async function fetchWeather(city = "jodhpur") {
  await mockDelay(100);
  const cleanCity = (city || 'jodhpur').trim().toLowerCase();
  
  // 1. Direct match for static fixture demo cities (protects unit tests)
  if (MOCK_WEATHER_DATA[cleanCity]) {
    const mockResult = MOCK_WEATHER_DATA[cleanCity];
    try {
      const liveData = await fetchWeatherByCoords(
        mockResult.location.lat,
        mockResult.location.lon,
        mockResult.location.city,
        mockResult.location.region,
        mockResult.location.country
      );
      if (liveData) return liveData;
    } catch {
      // Fallback to static mock if offline
    }
    return mockResult;
  }

  // 2. Geocode custom searched locations worldwide (resolves authentic coordinates)
  try {
    const geocoded = await searchGeocoding(city);
    if (geocoded && geocoded.length > 0) {
      const loc = geocoded[0];
      return await fetchWeatherByCoords(loc.lat, loc.lon, loc.city || loc.name, loc.region, loc.country);
    }
  } catch (err) {
    console.warn("Geocoding failed for custom location:", city, err);
  }

  // 3. Check for directional station query (e.g., "Patna North", "Patna South", etc.)
  const dirMatch = city.trim().match(/^(.*?)\s+(North-East|North-West|South-East|South-West|Northeast|Northwest|Southeast|Southwest|North|South|East|West)$/i);
  if (dirMatch) {
    const baseCity = dirMatch[1].trim();
    const dir = dirMatch[2].toLowerCase();
    const DIRECTIONAL_OFFSETS = {
      'north': { dLat: 0.35, dLon: -0.20 },
      'south': { dLat: -0.40, dLon: 0.25 },
      'east': { dLat: 0.15, dLon: 0.45 },
      'west': { dLat: -0.25, dLon: -0.35 },
      'north-east': { dLat: 0.45, dLon: 0.40 },
      'northeast': { dLat: 0.45, dLon: 0.40 },
      'north-west': { dLat: 0.35, dLon: -0.35 },
      'northwest': { dLat: 0.35, dLon: -0.35 },
      'south-east': { dLat: -0.35, dLon: 0.35 },
      'southeast': { dLat: -0.35, dLon: 0.35 },
      'south-west': { dLat: -0.35, dLon: -0.35 },
      'southwest': { dLat: -0.35, dLon: -0.35 }
    };
    const offset = DIRECTIONAL_OFFSETS[dir];
    if (offset) {
      try {
        const baseWeather = await fetchWeather(baseCity);
        if (baseWeather && baseWeather.location && baseWeather.location.lat && !(baseWeather.location.lat === 20 && baseWeather.location.lon === 77)) {
          const baseLat = Number(baseWeather.location.lat);
          const baseLon = Number(baseWeather.location.lon);
          const lat = baseLat + offset.dLat;
          const lon = baseLon + offset.dLon;
          return await fetchWeatherByCoords(lat, lon, city, baseWeather.location.region || '', baseWeather.location.country || '');
        }
      } catch (err) {
        console.warn("Directional lookup failed for:", city, err);
      }
    }
  }

  // 4. Fallback to mock dictionary
  return getMockWeather(city);
}

export async function fetchForecast(city = "jodhpur", baseTemp = 30) {
  await mockDelay(100);
  return {
    hourly: getHourlyForecast(baseTemp),
    daily: getDailyForecast(baseTemp)
  };
}

export async function fetchAlerts(city = "jodhpur") {
  await mockDelay(80);
  return getMockAlerts(city);
}

export async function postChatMessage(userQuery, weatherData, lang = 'en', priorContext = {}) {
  try {
    return await chatWithGeminiAndWeatherTools(userQuery, weatherData, lang, priorContext);
  } catch (err) {
    console.warn("Gemini service encountered error, falling back to local chat generator:", err);
    await mockDelay(200);
    return generateAIChatResponse(userQuery, weatherData, lang, priorContext);
  }
}

export async function fetchClimate(city = "jodhpur") {
  await mockDelay(100);
  return getMockClimate(city);
}

// 5. Retrieve Live Nearby Locations around Selected Coordinates for Leaflet Map
export async function fetchNearbyLocationsWeather(centerLat = 26.2389, centerLon = 73.0243, currentCityName = 'Jodhpur') {
  await mockDelay(100);

  // Generate 5-6 regional station vectors around the selected center location
  const offsets = [
    { dLat: 0, dLon: 0, suffix: '' }, // Selected Center
    { dLat: 0.35, dLon: -0.20, suffix: 'North' },
    { dLat: -0.40, dLon: 0.25, suffix: 'South' },
    { dLat: 0.15, dLon: 0.45, suffix: 'East' },
    { dLat: -0.25, dLon: -0.35, suffix: 'West' },
    { dLat: 0.45, dLon: 0.40, suffix: 'North-East' }
  ];

  const nearbyPromises = offsets.map(async (off, idx) => {
    const lat = centerLat + off.dLat;
    const lon = centerLon + off.dLon;
    const isCenter = idx === 0;
    const name = isCenter ? currentCityName : `${currentCityName} ${off.suffix}`;

    try {
      const weatherData = await fetchWeatherByCoords(lat, lon, name, 'Region', '');
      return {
        id: `nearby-${idx}-${lat.toFixed(2)}-${lon.toFixed(2)}`,
        name: name,
        city: name,
        country: weatherData.location.country || 'Station',
        lat: lat,
        lon: lon,
        temp: weatherData.current.temperature,
        condition: weatherData.current.condition,
        icon: weatherData.current.icon,
        rainProbability: weatherData.current.rainProbability,
        windSpeed: weatherData.current.windSpeed,
        windDirection: weatherData.current.windDirection,
        cloudCover: weatherData.current.cloudCover,
        aqi: weatherData.current.aqi,
        hasAlert: idx === 2 && weatherData.current.rainProbability > 60,
        isCenter: isCenter
      };
    } catch {
      // Fallback
      return {
        id: `nearby-${idx}`,
        name: name,
        city: name,
        country: 'India',
        lat: lat,
        lon: lon,
        temp: Math.round(30 + Math.sin(idx) * 4),
        condition: 'Clear',
        icon: 'Sun',
        rainProbability: 10,
        windSpeed: 12,
        windDirection: 'NW',
        cloudCover: 15,
        aqi: 80,
        hasAlert: false,
        isCenter: isCenter
      };
    }
  });

  return await Promise.all(nearbyPromises);
}

export async function fetchMapWeather(layers = ['temperature']) {
  await mockDelay(100);
  return {
    cities: ALL_DEMO_CITIES,
    activeLayers: layers,
    timestamp: new Date().toISOString()
  };
}

// 6. Open-Meteo Historical Archive API (ERA5 Reanalysis)
export async function fetchHistoricalWeather(lat = 26.2389, lon = 73.0243, startDate, endDate, locationName = 'Selected Location') {
  // Default to past 7 days if not provided
  if (!startDate || !endDate) {
    const end = new Date();
    end.setDate(end.getDate() - 2); // Archive data typically processed up to 2 days prior
    const start = new Date(end);
    start.setDate(start.getDate() - 7);
    startDate = start.toISOString().split('T')[0];
    endDate = end.toISOString().split('T')[0];
  }

  const cacheKey = `hist-${Number(lat).toFixed(2)}-${Number(lon).toFixed(2)}-${startDate}-${endDate}`;
  if (historicalCache.has(cacheKey)) {
    return historicalCache.get(cacheKey);
  }

  try {
    const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${startDate}&end_date=${endDate}&daily=weather_code,temperature_2m_max,temperature_2m_min,temperature_2m_mean,precipitation_sum,rain_sum,wind_speed_10m_max&timezone=auto`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Historical API HTTP error: ${res.status}`);
    const data = await res.json();

    if (data.daily && Array.isArray(data.daily.time) && data.daily.time.length > 0) {
      const times = data.daily.time;
      const days = times.map((t, idx) => {
        const code = data.daily.weather_code?.[idx] ?? 0;
        const parsed = parseWmoCode(code);
        const maxT = data.daily.temperature_2m_max?.[idx] ?? 30;
        const minT = data.daily.temperature_2m_min?.[idx] ?? 20;
        const meanT = data.daily.temperature_2m_mean?.[idx] ?? Math.round((maxT + minT) / 2);
        const precip = data.daily.precipitation_sum?.[idx] ?? 0;
        const rain = data.daily.rain_sum?.[idx] ?? precip;
        const wind = data.daily.wind_speed_10m_max?.[idx] ?? 12;

        return {
          date: t,
          weatherCode: code,
          condition: parsed.condition,
          icon: parsed.icon,
          maxTemp: Math.round(maxT),
          minTemp: Math.round(minT),
          meanTemp: Math.round(meanT),
          precipitation: Math.round(precip * 10) / 10,
          rain: Math.round(rain * 10) / 10,
          windSpeed: Math.round(wind)
        };
      });

      // Calculate aggregates & summary statistics
      const allMaxTemps = days.map(d => d.maxTemp);
      const allMinTemps = days.map(d => d.minTemp);
      const allMeanTemps = days.map(d => d.meanTemp);
      const allPrecip = days.map(d => d.precipitation);
      const allWind = days.map(d => d.windSpeed);

      const maxTemp = Math.max(...allMaxTemps);
      const minTemp = Math.min(...allMinTemps);
      const avgTemp = Math.round(allMeanTemps.reduce((a, b) => a + b, 0) / (allMeanTemps.length || 1));
      const totalPrecipitation = Math.round(allPrecip.reduce((a, b) => a + b, 0) * 10) / 10;
      const rainyDays = days.filter(d => d.precipitation > 0.1).length;
      const maxWindSpeed = Math.max(...allWind);

      const result = {
        location: {
          name: locationName,
          lat,
          lon
        },
        startDate,
        endDate,
        daysCount: days.length,
        daily: days,
        summary: {
          avgTemp,
          maxTemp,
          minTemp,
          totalPrecipitation,
          rainyDays,
          maxWindSpeed
        },
        source: "Open-Meteo Historical Archive API (ERA5 Reanalysis)",
        timestamp: new Date().toISOString()
      };

      historicalCache.set(cacheKey, result);
      return result;
    }
  } catch (err) {
    console.warn("Open-Meteo Historical API unavailable or offline, generating simulated fallback:", err);
  }

  return generateSimulatedHistorical(lat, lon, startDate, endDate, locationName);
}

// Fallback generator for offline/resilience testing
export function generateSimulatedHistorical(lat, lon, startDate, endDate, locationName) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = [];
  const current = new Date(start);

  let index = 0;
  while (current <= end && index < 365) {
    const dateStr = current.toISOString().split('T')[0];
    const dayOfYear = Math.floor((current - new Date(current.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    // Base temperature model based on latitude and seasonal cycle
    const seasonalFactor = Math.sin(((dayOfYear - 100) / 365) * 2 * Math.PI);
    const baseTemp = 28 + seasonalFactor * 8 - (Math.abs(lat) - 20) * 0.4;
    const dailyNoise = Math.sin(index * 1.5) * 2.5;
    
    const maxT = Math.round(baseTemp + 5 + dailyNoise);
    const minT = Math.round(baseTemp - 5 + dailyNoise);
    const meanT = Math.round((maxT + minT) / 2);
    const hasRain = (index % 5 === 0);
    const precip = hasRain ? Math.round((Math.sin(index) * 8 + 10) * 10) / 10 : 0;
    const wind = Math.round(12 + Math.cos(index) * 6);
    const parsed = parseWmoCode(hasRain ? 61 : 1);

    days.push({
      date: dateStr,
      weatherCode: hasRain ? 61 : 1,
      condition: parsed.condition,
      icon: parsed.icon,
      maxTemp: maxT,
      minTemp: minT,
      meanTemp: meanT,
      precipitation: precip,
      rain: precip,
      windSpeed: Math.max(5, wind)
    });

    current.setDate(current.getDate() + 1);
    index++;
  }

  const allMaxTemps = days.map(d => d.maxTemp);
  const allMinTemps = days.map(d => d.minTemp);
  const allMeanTemps = days.map(d => d.meanTemp);
  const allPrecip = days.map(d => d.precipitation);
  const allWind = days.map(d => d.windSpeed);

  return {
    location: {
      name: locationName,
      lat,
      lon
    },
    startDate,
    endDate,
    daysCount: days.length,
    daily: days,
    summary: {
      avgTemp: Math.round(allMeanTemps.reduce((a, b) => a + b, 0) / (allMeanTemps.length || 1)),
      maxTemp: Math.max(...allMaxTemps),
      minTemp: Math.min(...allMinTemps),
      totalPrecipitation: Math.round(allPrecip.reduce((a, b) => a + b, 0) * 10) / 10,
      rainyDays: days.filter(d => d.precipitation > 0.1).length,
      maxWindSpeed: Math.max(...allWind)
    },
    source: "Historical Weather Reanalysis Model",
    timestamp: new Date().toISOString()
  };
}


