// Weather State Management Hook (Enhanced for A11-A22)

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  fetchWeather, 
  fetchForecast, 
  fetchAlerts, 
  fetchClimate, 
  fetchWeatherByCoords, 
  reverseGeocodeCoords 
} from '../services/api';
import { useLocalStorage } from './useLocalStorage';

export function useWeather(initialCity = 'jodhpur') {
  const [city, setCity] = useState(initialCity);
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [climate, setClimate] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Settings preferences persisted in localStorage
  const [tempUnit, setTempUnit] = useLocalStorage('weathergpt_temp_unit', 'C'); // 'C' | 'F'
  const [windUnit, setWindUnit] = useLocalStorage('weathergpt_wind_unit', 'kmh'); // 'kmh' | 'mph'

  // User Context Mode (A17): 'general' | 'farmer' | 'traveler' | 'outdoor' | 'emergency'
  const [userMode, setUserMode] = useLocalStorage('weathergpt_user_mode', 'general');

  // Smart Alert Preferences (A20)
  const [alertPreferences, setAlertPreferences] = useLocalStorage('weathergpt_alert_prefs', {
    types: {
      heavyRain: true,
      thunderstorm: true,
      extremeHeat: true,
      strongWind: true,
      poorAQI: true,
      extremeCold: true
    },
    frequency: 'immediate' // 'immediate' | 'important' | 'daily'
  });

  // History state
  const [searchHistory, setSearchHistory] = useLocalStorage('weathergpt_search_history', []);

  // Location Geolocation state
  const [geoState, setGeoState] = useState({ status: 'idle', message: '', coords: null });

  // Map layer state (A18)
  const [mapLayer, setMapLayer] = useState('temperature'); // 'temperature' | 'rain' | 'wind' | 'clouds' | 'alerts' | 'aqi'

  const lastLoadedCityRef = useRef('');
  const isLocatingRef = useRef(false);

  const loadWeatherData = useCallback(async (targetCity) => {
    if (!targetCity) return;
    if (lastLoadedCityRef.current && lastLoadedCityRef.current === targetCity.toLowerCase()) {
      return;
    }
    lastLoadedCityRef.current = targetCity.toLowerCase();
    setLoading(true);
    setError(null);

    try {
      const weatherRes = await fetchWeather(targetCity);
      const forecastRes = await fetchForecast(targetCity, weatherRes.current.temperature);
      const alertsRes = await fetchAlerts(targetCity);
      const climateRes = await fetchClimate(targetCity);

      setWeather(weatherRes);
      setForecast(forecastRes);
      setAlerts(alertsRes);
      setClimate(climateRes);

      // Save to search history if valid
      if (weatherRes?.location?.city) {
        setSearchHistory((prev) => {
          const filtered = prev.filter(
            (item) => item.city.toLowerCase() !== weatherRes.location.city.toLowerCase()
          );
          return [
            {
              city: weatherRes.location.city,
              country: weatherRes.location.country,
              query: targetCity,
              timestamp: new Date().toISOString()
            },
            ...filtered
          ].slice(0, 10);
        });
      }

      // Update weather atmosphere on document body
      const cond = weatherRes.current.condition.toLowerCase();
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
      console.error("Failed to load weather data:", err);
      setError(err.message || "Weather data couldn't be loaded. Please check your query or try again.");
    } finally {
      setLoading(false);
    }
  }, [setSearchHistory]);

  useEffect(() => {
    loadWeatherData(city);
  }, [city, loadWeatherData]);

  // Request browser geolocation & map directly to real coordinates & location
  // Guarded against duplicate requests and repeated permission loops
  const requestLocation = useCallback(() => {
    // Duplicate request protection: if a location request is already in progress, ignore
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
        setLoading(true);
        setError(null);
        try {
          // Reverse geocode coords to get city, region, country
          const geoInfo = await reverseGeocodeCoords(latitude, longitude);
          const detectedCity = geoInfo.city || `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`;

          // Fetch real Open-Meteo live weather data for these exact coordinates
          const weatherRes = await fetchWeatherByCoords(latitude, longitude, detectedCity, geoInfo.region, geoInfo.country);
          const forecastRes = await fetchForecast(detectedCity, weatherRes.current.temperature);
          const alertsRes = await fetchAlerts(detectedCity);
          const climateRes = await fetchClimate(detectedCity);

          lastLoadedCityRef.current = detectedCity.toLowerCase();
          setWeather(weatherRes);
          setForecast(forecastRes);
          setAlerts(alertsRes);
          setClimate(climateRes);
          setCity(detectedCity);

          setGeoState({
            status: 'success',
            message: `Location detected: ${detectedCity}${geoInfo.region && geoInfo.region !== detectedCity ? `, ${geoInfo.region}` : ''}`,
            coords: { latitude, longitude }
          });

          // Save to search history
          setSearchHistory((prev) => {
            const filtered = prev.filter(
              (item) => item.city.toLowerCase() !== detectedCity.toLowerCase()
            );
            return [
              {
                city: detectedCity,
                country: geoInfo.country || 'Current Location',
                query: detectedCity,
                timestamp: new Date().toISOString()
              },
              ...filtered
            ].slice(0, 10);
          });

          // Update weather atmosphere on document body
          const cond = weatherRes.current.condition.toLowerCase();
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
            message: 'Location access was denied. Please allow location access in your browser.'
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
  }, [setSearchHistory]);

  // Bi-directional map city selector
  const selectCityFromMap = (cityName) => {
    if (cityName && cityName.toLowerCase() !== city.toLowerCase()) {
      lastLoadedCityRef.current = '';
      setCity(cityName);
    }
  };

  const clearHistory = () => setSearchHistory([]);

  return {
    city,
    setCity: (newCity) => {
      lastLoadedCityRef.current = '';
      setCity(newCity);
    },
    weather,
    forecast,
    alerts,
    climate,
    loading,
    error,
    retry: () => {
      lastLoadedCityRef.current = '';
      loadWeatherData(city);
    },
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
