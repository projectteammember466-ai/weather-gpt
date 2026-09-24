import { ProviderError } from '../middleware/errorHandler.js';

export async function searchLocations(query) {
  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    return [];
  }

  const cleanQuery = query.trim();

  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cleanQuery)}&count=10&language=en&format=json`;
    const res = await fetch(url, { signal: AbortSignal.timeout ? AbortSignal.timeout(4000) : undefined });

    if (!res.ok) {
      throw new ProviderError(`Geocoding service returned HTTP status ${res.status}`);
    }

    const data = await res.json();

    if (data.results && Array.isArray(data.results)) {
      return data.results.map((item) => ({
        id: `geo-${item.id}`,
        name: item.name,
        city: item.name,
        admin1: item.admin1 || item.admin2 || item.country || '',
        country: item.country || '',
        countryCode: item.country_code || '',
        latitude: item.latitude,
        longitude: item.longitude,
        timezone: item.timezone || 'UTC',
        population: item.population || 0
      }));
    }

    return [];
  } catch (err) {
    if (err instanceof ProviderError) throw err;
    throw new ProviderError(`Unable to complete location search: ${err.message}`);
  }
}

export default {
  searchLocations
};
