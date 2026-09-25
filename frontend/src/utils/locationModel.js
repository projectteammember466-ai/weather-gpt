/**
 * WeatherGPT Authoritative Canonical Location Model
 * Single source of truth for location data used across Search, Weather, Forecast,
 * Alerts, Leaflet Map, Historical Weather, AI Context, and Firestore Persistence.
 */

export function createCanonicalLocation(data = {}) {
  const lat = Number(data.latitude ?? data.lat ?? 26.2389);
  const lon = Number(data.longitude ?? data.lon ?? 73.0243);
  const name = data.name || data.city || 'Jodhpur';
  const state = data.state || data.region || data.admin1 || '';
  const country = data.country || 'India';
  
  let displayName = data.displayName || name;
  if (!data.displayName && (state || country)) {
    const parts = [name];
    if (state && state.toLowerCase() !== name.toLowerCase()) parts.push(state);
    if (country) parts.push(country);
    displayName = parts.join(', ');
  }

  return {
    id: data.id || `loc-${lat.toFixed(4)}-${lon.toFixed(4)}`,
    name,
    city: name,
    displayName,
    latitude: lat,
    longitude: lon,
    lat,
    lon,
    state,
    region: state,
    country,
    countryCode: data.countryCode || data.country_code || '',
    timezone: data.timezone || 'Asia/Kolkata',
    source: data.source || 'Open-Meteo',
    isCurrentLocation: Boolean(data.isCurrentLocation)
  };
}

export function isSameLocation(locA, locB) {
  if (!locA || !locB) return false;
  if (locA.latitude && locB.latitude && locA.longitude && locB.longitude) {
    const dLat = Math.abs(Number(locA.latitude) - Number(locB.latitude));
    const dLon = Math.abs(Number(locA.longitude) - Number(locB.longitude));
    if (dLat < 0.001 && dLon < 0.001) return true;
  }
  if (locA.name && locB.name) {
    return locA.name.toLowerCase() === locB.name.toLowerCase();
  }
  return false;
}

export default {
  createCanonicalLocation,
  isSameLocation
};
