import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage.js';

export const DEFAULT_SAVED_LOCATIONS = [
  {
    name: 'Jodhpur',
    city: 'Jodhpur',
    country: 'India',
    region: 'Rajasthan',
    displayName: 'Jodhpur, Rajasthan',
    latitude: 26.2389,
    longitude: 73.0243
  },
  {
    name: 'Jaipur',
    city: 'Jaipur',
    country: 'India',
    region: 'Rajasthan',
    displayName: 'Jaipur, Rajasthan',
    latitude: 26.9124,
    longitude: 75.7873
  },
  {
    name: 'Delhi',
    city: 'Delhi',
    country: 'India',
    region: 'Delhi',
    displayName: 'Delhi, India',
    latitude: 28.6139,
    longitude: 77.2090
  }
];

export function useSavedLocations() {
  const [savedLocations, setSavedLocations] = useLocalStorage('weathergpt_saved_locations', DEFAULT_SAVED_LOCATIONS);

  const isSaved = useCallback((cityName) => {
    if (!cityName) return false;
    const clean = cityName.trim().toLowerCase();
    return savedLocations.some(
      (loc) => (loc.city || loc.name || '').trim().toLowerCase() === clean
    );
  }, [savedLocations]);

  const addLocation = useCallback((loc) => {
    if (!loc) return false;
    const cityName = (loc.city || loc.name || '').trim();
    if (!cityName) return false;

    // Check duplicate
    if (isSaved(cityName)) return false;

    const normalized = {
      name: cityName,
      city: cityName,
      country: loc.country || 'India',
      region: loc.region || loc.state || '',
      displayName: loc.displayName || `${cityName}${loc.region ? `, ${loc.region}` : loc.country ? `, ${loc.country}` : ''}`,
      latitude: loc.latitude || loc.lat || 0,
      longitude: loc.longitude || loc.lon || 0
    };

    setSavedLocations((prev) => [normalized, ...prev]);
    return true;
  }, [isSaved, setSavedLocations]);

  const removeLocation = useCallback((cityName) => {
    if (!cityName) return;
    const clean = cityName.trim().toLowerCase();
    setSavedLocations((prev) =>
      prev.filter((loc) => (loc.city || loc.name || '').trim().toLowerCase() !== clean)
    );
  }, [setSavedLocations]);

  const toggleLocation = useCallback((loc) => {
    if (!loc) return false;
    const cityName = (loc.city || loc.name || '').trim();
    if (isSaved(cityName)) {
      removeLocation(cityName);
      return false; // Now unsaved
    } else {
      addLocation(loc);
      return true; // Now saved
    }
  }, [isSaved, removeLocation, addLocation]);

  return {
    savedLocations,
    addLocation,
    removeLocation,
    toggleLocation,
    isSaved
  };
}
