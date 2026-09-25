// Weather State Management Hook with Authoritative Canonical Location Model & Stale-Response Protection

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  fetchForecast, 
  fetchAlerts, 
  fetchClimate, 
  fetchWeatherByCoords, 
  reverseGeocodeCoords,
  searchGeocoding
} from '../services/api';
import { useLocalStorage } from './useLocalStorage';
import { createCanonicalLocation } from '../utils/locationModel';
import { getOrCreateUserId } from '../utils/userId';
import { addSearchHistory as addBackendSearchHistory, syncUserProfile } from '../services/backendApi';

export function useWeather(initialCity = 'jodhpur') {
  const userId = getOrCreateUserId();
  
  // Initial canonical location setup
  const [location, setLocation] = useState(() => 
    createCanonicalLocation({
      name: typeof initialCity === 'string' ? initialCity : initialCity?.name || 'Jodhpur',
      latitude: initialCity?.latitude || initialCity?.lat || 26.2389,
      longitude: initialCity?.longitude || initialCity?.lon || 73.0243,
      country: 'India',
      state: 'Rajasthan'
    })
  );

  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [climate, setClimate] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Settings preferences persisted in localStorage & synced
  const [tempUnit, setTempUnit] = useLocalStorage('weathergpt_temp_unit', 'C');
  const [windUnit, setWindUnit] = useLocalStorage('weathergpt_wind_unit', 'kmh');

  // User Context Mode
  const [userMode, setUserMode] = useLocalStorage('weathergpt_user_mode', 'general');

  // Smart Alert Preferences
  const [alertPreferences, setAlertPreferences] = useLocalStorage('weathergpt_alert_prefs', {
    types: {
      heavyRain: true,
      thunderstorm: true,
      extremeHeat: true,
      strongWind: true,
      poorAQI: true,
      extremeCold: true
    },
    frequency: 'immediate'
  });

  // Search history state
  const [searchHistory, setSearchHistory] = useLocalStorage('weathergpt_search_history', []);

  // Location Geolocation state
  const [geoState, setGeoState] = useState({ status: 'idle', message: '', coords: null });

  // Map layer state
  const [mapLayer, setMapLayer] = useState('temperature');

  // Sequence token / request counter ref to prevent race conditions from stale requests
  const requestIdRef = useRef(0);
  const isLocatingRef = useRef(false);

  // Ensure user profile document exists in Firestore on load
  useEffect(() => {
    syncUserProfile(userId, {
      language: 'en',
      temperatureUnit: tempUnit === 'C' ? 'celsius' : 'fahrenheit',
      contextMode: userMode
    }).catch(() => {});
  }, [userId, tempUnit, userMode]);

  /**
   * Load Weather Data for a target (string query or Canonical Location object)
   */
  const loadWeatherData = useCallback(async (target) => {
    if (!target) return;
    
    // Increment request ID sequence token
    const currentRequestId = ++requestIdRef.current;
    
    setLoading(true);
    setError(null);

    try {
      let canonicalLoc = null;
      let rawQueryText = '';

      if (typeof target === 'object' && target !== null && (target.latitude || target.lat)) {
        canonicalLoc = createCanonicalLocation(target);
        rawQueryText = target.displayName || target.name || '';
      } else if (typeof target === 'string') {
        rawQueryText = target.trim();
        // Resolve canonical coordinates via geocoding
        const geocoded = await searchGeocoding(rawQueryText);
        if (geocoded && geocoded.length > 0) {
          canonicalLoc = createCanonicalLocation(geocoded[0]);
        } else {
          // Fallback location object
          canonicalLoc = createCanonicalLocation({
            name: rawQueryText,
            latitude: 26.2389,
            longitude: 73.0243,
            country: 'India'
          });
        }
      }

      if (!canonicalLoc) return;

      // Stale response guard
      if (currentRequestId !== requestIdRef.current) {
        console.warn(`[useWeather] Stale request #${currentRequestId} discarded for #${requestIdRef.current}`);
        return;
      }

      const { latitude, longitude, name, state, country } = canonicalLoc;

      // Fetch live telemetry using exact canonical coordinates
      const weatherRes = await fetchWeatherByCoords(latitude, longitude, name, state, country);
      const forecastRes = await fetchForecast(name, weatherRes.current.temperature);
      const alertsRes = await fetchAlerts(name);
      const climateRes = await fetchClimate(name);

      // Check stale guard again after async fetches
      if (currentRequestId !== requestIdRef.current) return;

      setLocation(canonicalLoc);
      setWeather(weatherRes);
      setForecast(forecastRes);
      setAlerts(alertsRes);
      setClimate(climateRes);

      // Persist resolved canonical location to Search History (Local + Backend Firestore)
      const historyRecord = {
        city: canonicalLoc.name,
        country: canonicalLoc.country || 'Location',
        query: rawQueryText || canonicalLoc.name,
        displayName: canonicalLoc.displayName,
        latitude: canonicalLoc.latitude,
        longitude: canonicalLoc.longitude,
        timestamp: new Date().toISOString()
      };

      setSearchHistory((prev) => {
        const filtered = prev.filter(
          (item) => (item.city || '').toLowerCase() !== canonicalLoc.name.toLowerCase()
        );
        return [historyRecord, ...filtered].slice(0, 10);
      });

      // Async Firestore persistence
      addBackendSearchHistory(userId, {
        rawQuery: rawQueryText,
        resolvedName: canonicalLoc.name,
        location: canonicalLoc.displayName,
        latitude: canonicalLoc.latitude,
        longitude: canonicalLoc.longitude,
        country: canonicalLoc.country,
        state: canonicalLoc.state
      }).catch(() => {});

      // Update weather atmosphere CSS on document body
      const cond = (weatherRes.current?.condition || '').toLowerCase();
      document.body.classList.remove(
        'weather-sunny', 'weather-cloudy', 'weather-rain', 
        'weather-storm', 'weather-snow', 'weather-night'
      );

      if (cond.includes('rain') || cond.includes('shower')) {
        document.body.classList.add('weather-rain');
      } else if (cond.includes('storm') || cond.includes('thunder')) {
        document.body.classList.add('weather-storm');
      } else if (cond.includes('snow') || cond.includes('blizzard')) {
        document.body.classList.add('weather-snow');
      } else if (cond.includes('cloud')) {
        document.body.classList.add('weather-cloudy');
      } else if (cond.includes('night')) {
        document.body.classList.add('weather-night');
      } else {
        document.body.classList.add('weather-sunny');
      }

    } catch (err) {
      if (currentRequestId === requestIdRef.current) {
        console.error("Failed to load weather data:", err);
        setError(err.message || "Weather data couldn't be loaded. Please try again.");
      }
    } finally {
      if (currentRequestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, [userId, setSearchHistory]);

  /**
   * Request Browser Geolocation & center map + weather on exact detected coordinates
   */
  const requestLocation = useCallback(() => {
    if (isLocatingRef.current) {
      console.warn("Geolocation request already in progress. Ignoring duplicate trigger.");
      return;
    }

    if (!navigator.geolocation) {
      setGeoState({ status: 'unavailable', message: 'Geolocation is not supported by your browser.' });
      return;
    }

    isLocatingRef.current = true;
    setGeoState({ status: 'requesting', message: 'Locating...', coords: null });

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const currentRequestId = ++requestIdRef.current;
        setLoading(true);
        setError(null);

        try {
          // Reverse geocode coords to get city, region, country
          const geoInfo = await reverseGeocodeCoords(latitude, longitude);
          const detectedCity = geoInfo.city || `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`;

          const canonicalLoc = createCanonicalLocation({
            id: `curr-${latitude.toFixed(4)}-${longitude.toFixed(4)}`,
            name: detectedCity,
            city: detectedCity,
            displayName: geoInfo.region ? `${detectedCity}, ${geoInfo.region}, ${geoInfo.country}` : `${detectedCity}, ${geoInfo.country}`,
            latitude,
            longitude,
            region: geoInfo.region,
            state: geoInfo.region,
            country: geoInfo.country,
            isCurrentLocation: true
          });

          // Fetch real Open-Meteo live weather data for exact coordinates
          const weatherRes = await fetchWeatherByCoords(latitude, longitude, detectedCity, geoInfo.region, geoInfo.country);
          const forecastRes = await fetchForecast(detectedCity, weatherRes.current.temperature);
          const alertsRes = await fetchAlerts(detectedCity);
          const climateRes = await fetchClimate(detectedCity);

          if (currentRequestId !== requestIdRef.current) return;

          setLocation(canonicalLoc);
          setWeather(weatherRes);
          setForecast(forecastRes);
          setAlerts(alertsRes);
          setClimate(climateRes);

          setGeoState({
            status: 'success',
            message: `Current location: ${detectedCity}${geoInfo.region ? `, ${geoInfo.region}` : ''}`,
            coords: { latitude, longitude }
          });

          // Save to search history
          setSearchHistory((prev) => {
            const filtered = prev.filter(
              (item) => (item.city || '').toLowerCase() !== detectedCity.toLowerCase()
            );
            return [
              {
                city: detectedCity,
                country: geoInfo.country || 'Current Location',
                query: detectedCity,
                displayName: canonicalLoc.displayName,
                latitude,
                longitude,
                timestamp: new Date().toISOString()
              },
              ...filtered
            ].slice(0, 10);
          });

          addBackendSearchHistory(userId, {
            rawQuery: 'Current Device Location',
            resolvedName: detectedCity,
            location: canonicalLoc.displayName,
            latitude,
            longitude,
            country: geoInfo.country,
            state: geoInfo.region
          }).catch(() => {});

        } catch (err) {
          console.error("Failed to load weather for detected location:", err);
          setGeoState({
            status: 'error',
            message: 'Unable to fetch weather for your coordinates. Please search for a city.'
          });
        } finally {
          setLoading(false);
          isLocatingRef.current = false;
        }
      },
      (err) => {
        isLocatingRef.current = false;
        if (err.code === err.PERMISSION_DENIED) {
          setGeoState({
            status: 'denied',
            message: 'Location access was denied. Please allow location permission in your browser.'
          });
        } else if (err.code === err.TIMEOUT) {
          setGeoState({
            status: 'error',
            message: 'Location request timed out. Please try again.'
          });
        } else {
          setGeoState({
            status: 'unavailable',
            message: 'Unable to detect your location. Please search for a city.'
          });
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  }, [userId, setSearchHistory]);

  const selectCityFromMap = (cityName) => {
    if (cityName) {
      loadWeatherData(cityName);
    }
  };

  const clearHistory = () => setSearchHistory([]);

  return {
    location,
    city: location.name,
    setCity: (target) => loadWeatherData(target),
    selectLocation: (targetLoc) => loadWeatherData(targetLoc),
    weather,
    forecast,
    alerts,
    climate,
    loading,
    error,
    retry: () => loadWeatherData(location),
    tempUnit,
    setTempUnit,
    windUnit,
    setWindUnit,
    userMode,
    setUserMode,
    alertPreferences,
    setAlertPreferences,
    mapLayer,
    setMapLayer,
    selectCityFromMap,
    searchHistory,
    clearHistory,
    geoState,
    requestLocation
  };
}

export default useWeather;
