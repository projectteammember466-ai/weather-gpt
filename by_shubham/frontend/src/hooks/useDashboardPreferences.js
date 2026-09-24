import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage.js';

export const DEFAULT_SECTION_ORDER = [
  'currentWeather',
  'weatherDetails',
  'smartGuidance',
  'weatherTimeline',
  'weatherChart',
  'dailyForecast',
  'alertsAndSummary',
  'sunMoon',
  'weatherMap',
  'climate'
];

export const DEFAULT_SECTION_VISIBILITY = {
  currentWeather: true,
  weatherDetails: true,
  smartGuidance: true,
  weatherTimeline: true,
  weatherChart: true,
  dailyForecast: true,
  alertsAndSummary: true,
  sunMoon: true,
  weatherMap: true,
  climate: true
};

export function useDashboardPreferences() {
  const [preferences, setPreferences] = useLocalStorage(
    'weathergpt_dashboard_preferences',
    DEFAULT_SECTION_VISIBILITY
  );

  const [sectionOrder, setSectionOrder] = useLocalStorage(
    'weathergpt_dashboard_order',
    DEFAULT_SECTION_ORDER
  );

  const toggleSection = useCallback((sectionKey) => {
    setPreferences((prev) => ({
      ...prev,
      [sectionKey]: prev[sectionKey] === false ? true : false
    }));
  }, [setPreferences]);

  const moveSection = useCallback((index, direction) => {
    setSectionOrder((prev) => {
      const newOrder = [...prev];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= newOrder.length) return prev;
      
      const temp = newOrder[index];
      newOrder[index] = newOrder[targetIndex];
      newOrder[targetIndex] = temp;
      return newOrder;
    });
  }, [setSectionOrder]);

  const resetPreferences = useCallback(() => {
    setPreferences(DEFAULT_SECTION_VISIBILITY);
    setSectionOrder(DEFAULT_SECTION_ORDER);
  }, [setPreferences, setSectionOrder]);

  return {
    preferences,
    sectionOrder,
    toggleSection,
    moveSection,
    resetPreferences,
    isSectionVisible: (key) => preferences[key] !== false
  };
}
