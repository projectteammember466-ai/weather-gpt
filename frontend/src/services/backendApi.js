/**
 * WeatherGPT Backend API Integration Layer
 * Connects frontend React components to Express REST Gateway (/api/v1)
 */

export const BACKEND_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_BACKEND_URL) ||
  'http://localhost:5000/api/v1';

let backendHealthChecked = false;
let backendIsOnline = true;

/**
 * Check backend health status
 */
export async function checkBackendHealth() {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/health`, {
      signal: AbortSignal.timeout ? AbortSignal.timeout(2000) : undefined
    });
    if (res.ok) {
      const json = await res.json();
      backendIsOnline = json.success === true;
      backendHealthChecked = true;
      return json;
    }
  } catch (err) {
    backendIsOnline = false;
    backendHealthChecked = true;
  }
  return null;
}

export function isBackendOnline() {
  return backendIsOnline;
}

/**
 * Weather Telemetry via Express Backend
 */
export async function fetchBackendWeather(lat, lon, locationName = 'Selected Location') {
  try {
    const res = await fetch(
      `${BACKEND_BASE_URL}/weather?lat=${lat}&lon=${lon}&locationName=${encodeURIComponent(locationName)}`,
      { signal: AbortSignal.timeout ? AbortSignal.timeout(4000) : undefined }
    );
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        return json.data;
      }
    }
  } catch (err) {
    console.warn("Express backend weather endpoint unavailable, using direct fallback:", err);
  }
  return null;
}

/**
 * Forecast Telemetry via Express Backend
 */
export async function fetchBackendForecast(lat, lon, days = 7) {
  try {
    const res = await fetch(
      `${BACKEND_BASE_URL}/forecast?lat=${lat}&lon=${lon}&days=${days}`,
      { signal: AbortSignal.timeout ? AbortSignal.timeout(4000) : undefined }
    );
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        return json.data;
      }
    }
  } catch (err) {
    console.warn("Express backend forecast endpoint unavailable, using direct fallback:", err);
  }
  return null;
}

/**
 * Historical Climate Data via Express Backend
 */
export async function fetchBackendHistorical(lat, lon, startDate, endDate, locationName = 'Selected Location') {
  try {
    let url = `${BACKEND_BASE_URL}/historical?lat=${lat}&lon=${lon}&locationName=${encodeURIComponent(locationName)}`;
    if (startDate && endDate) {
      url += `&startDate=${startDate}&endDate=${endDate}`;
    }
    const res = await fetch(url, {
      signal: AbortSignal.timeout ? AbortSignal.timeout(5000) : undefined
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        return json.data;
      }
    }
  } catch (err) {
    console.warn("Express backend historical endpoint unavailable, using direct fallback:", err);
  }
  return null;
}

/**
 * Location Geocoding via Express Backend
 */
export async function searchBackendLocations(query) {
  try {
    const res = await fetch(
      `${BACKEND_BASE_URL}/locations/search?q=${encodeURIComponent(query)}`,
      { signal: AbortSignal.timeout ? AbortSignal.timeout(3500) : undefined }
    );
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        return json.data.map(loc => ({
          id: loc.id || `geo-${loc.latitude}-${loc.longitude}`,
          name: loc.name,
          city: loc.city || loc.name,
          region: loc.admin1 || loc.country || '',
          country: loc.country || '',
          countryCode: loc.countryCode || '',
          lat: loc.latitude,
          lon: loc.longitude,
          latitude: loc.latitude,
          longitude: loc.longitude,
          timezone: loc.timezone || 'UTC'
        }));
      }
    }
  } catch (err) {
    console.warn("Express backend location search unavailable, using direct fallback:", err);
  }
  return null;
}

/**
 * Weather Alerts via Express Backend
 */
export async function fetchBackendAlerts(lat, lon, city = '') {
  try {
    const res = await fetch(
      `${BACKEND_BASE_URL}/alerts?lat=${lat}&lon=${lon}&city=${encodeURIComponent(city)}`,
      { signal: AbortSignal.timeout ? AbortSignal.timeout(3500) : undefined }
    );
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        return json.data.alerts || [];
      }
    }
  } catch (err) {
    console.warn("Express backend alerts endpoint unavailable, using direct fallback:", err);
  }
  return null;
}

/**
 * AI Chat Assistant via Express Backend
 */
export async function postBackendChat(userQuery, location, contextMode = 'general', language = 'en', userId = 'anonymous') {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: userQuery,
        location,
        contextMode,
        language,
        userId
      }),
      signal: AbortSignal.timeout ? AbortSignal.timeout(6000) : undefined
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        return json.data;
      }
    }
  } catch (err) {
    console.warn("Express backend chat endpoint unavailable, using direct fallback:", err);
  }
  return null;
}

/**
 * Saved Locations Synchronization via Express Backend (Firestore API)
 */
export async function fetchBackendSavedLocations(userId = 'anonymous') {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/locations/saved?userId=${userId}`, {
      signal: AbortSignal.timeout ? AbortSignal.timeout(3000) : undefined
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        return json.data;
      }
    }
  } catch (err) {
    console.warn("Backend saved locations fetch error:", err);
  }
  return null;
}

export async function addBackendSavedLocation(locationData, userId = 'anonymous') {
  try {
    await fetch(`${BACKEND_BASE_URL}/locations/saved`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, ...locationData }),
      signal: AbortSignal.timeout ? AbortSignal.timeout(3000) : undefined
    });
  } catch (err) {
    console.warn("Backend saved location add error:", err);
  }
}

export async function removeBackendSavedLocation(locationId, userId = 'anonymous') {
  try {
    await fetch(`${BACKEND_BASE_URL}/locations/saved/${userId}/${locationId}`, {
      method: 'DELETE',
      signal: AbortSignal.timeout ? AbortSignal.timeout(3000) : undefined
    });
  } catch (err) {
    console.warn("Backend saved location remove error:", err);
  }
}

/**
 * Dashboard Preferences Synchronization via Express Backend (Firestore API)
 */
export async function fetchDashboardPreferences(userId = 'anonymous') {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/user/dashboard-preferences?userId=${userId}`, {
      signal: AbortSignal.timeout ? AbortSignal.timeout(3000) : undefined
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        return json.data;
      }
    }
  } catch (err) {
    console.warn("Backend dashboard preferences fetch error:", err);
  }
  return null;
}

export async function saveDashboardPreferences(userId = 'anonymous', preferences = {}) {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/user/dashboard-preferences`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, ...preferences }),
      signal: AbortSignal.timeout ? AbortSignal.timeout(3000) : undefined
    });
    if (res.ok) {
      const json = await res.json();
      return json.data;
    }
  } catch (err) {
    console.warn("Backend dashboard preferences save error:", err);
  }
  return null;
}

/**
 * Search History Persistence via Express Backend (Firestore API)
 */
export async function addSearchHistory(userId = 'anonymous', searchData = {}) {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/history/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, ...searchData }),
      signal: AbortSignal.timeout ? AbortSignal.timeout(3000) : undefined
    });
    if (res.ok) {
      const json = await res.json();
      return json.data;
    }
  } catch (err) {
    console.warn("Backend search history save error:", err);
  }
  return null;
}

export async function fetchSearchHistory(userId = 'anonymous', limit = 10) {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/history/search?userId=${userId}&limit=${limit}`, {
      signal: AbortSignal.timeout ? AbortSignal.timeout(3000) : undefined
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        return json.data;
      }
    }
  } catch (err) {
    console.warn("Backend search history fetch error:", err);
  }
  return null;
}

export async function deleteBackendSearchHistory(searchId, userId = 'anonymous') {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/history/search/${searchId}?userId=${userId}`, {
      method: 'DELETE',
      signal: AbortSignal.timeout ? AbortSignal.timeout(3000) : undefined
    });
    if (res.ok) {
      const json = await res.json();
      return json.data;
    }
  } catch (err) {
    console.warn("Backend search history delete error:", err);
  }
  return null;
}

/**
 * User Profile & Settings Sync via Express Backend (Firestore API)
 */
export async function syncUserProfile(userId = 'anonymous', userData = {}) {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/user/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, ...userData }),
      signal: AbortSignal.timeout ? AbortSignal.timeout(3000) : undefined
    });
    if (res.ok) {
      const json = await res.json();
      return json.data;
    }
  } catch (err) {
    console.warn("Backend profile sync error:", err);
  }
  return null;
}

export default {
  checkBackendHealth,
  isBackendOnline,
  fetchBackendWeather,
  fetchBackendForecast,
  fetchBackendHistorical,
  searchBackendLocations,
  fetchBackendAlerts,
  postBackendChat,
  fetchBackendSavedLocations,
  addBackendSavedLocation,
  removeBackendSavedLocation,
  fetchDashboardPreferences,
  saveDashboardPreferences,
  addSearchHistory,
  fetchSearchHistory,
  deleteBackendSearchHistory,
  syncUserProfile
};
