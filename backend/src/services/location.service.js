const DEMO_CITIES = [
  { name: 'Jodhpur', city: 'Jodhpur', admin1: 'Rajasthan', country: 'India', countryCode: 'IN', latitude: 26.2389, longitude: 73.0243, timezone: 'Asia/Kolkata' },
  { name: 'Jaipur', city: 'Jaipur', admin1: 'Rajasthan', country: 'India', countryCode: 'IN', latitude: 26.9124, longitude: 75.7873, timezone: 'Asia/Kolkata' },
  { name: 'Delhi', city: 'Delhi', admin1: 'Delhi', country: 'India', countryCode: 'IN', latitude: 28.6139, longitude: 77.2090, timezone: 'Asia/Kolkata' },
  { name: 'Mumbai', city: 'Mumbai', admin1: 'Maharashtra', country: 'India', countryCode: 'IN', latitude: 19.0760, longitude: 72.8777, timezone: 'Asia/Kolkata' },
  { name: 'Bengaluru', city: 'Bengaluru', admin1: 'Karnataka', country: 'India', countryCode: 'IN', latitude: 12.9716, longitude: 77.5946, timezone: 'Asia/Kolkata' }
];

export async function searchLocations(query) {
  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    return [];
  }

  const cleanQuery = query.trim().toLowerCase();

  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cleanQuery)}&count=10&language=en&format=json`;
    const res = await fetch(url, { signal: AbortSignal.timeout ? AbortSignal.timeout(8000) : undefined });

    if (res.ok) {
      const data = await res.json();
      if (data.results && Array.isArray(data.results) && data.results.length > 0) {
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
    }
  } catch (err) {
    console.warn(`Geocoding search notice for ${cleanQuery}, using fallback search:`, err.message);
  }

  // Fallback demo cities search
  const matches = DEMO_CITIES.filter(c =>
    c.name.toLowerCase().includes(cleanQuery) || c.city.toLowerCase().includes(cleanQuery)
  );

  return matches.map(c => ({
    id: `geo-fallback-${c.name.toLowerCase()}`,
    ...c
  }));
}

export default {
  searchLocations
};
