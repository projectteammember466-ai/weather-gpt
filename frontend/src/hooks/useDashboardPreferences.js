import { useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage.js';
import { fetchDashboardPreferences, saveDashboardPreferences } from '../services/backendApi.js';
import { getOrCreateUserId } from '../utils/userId.js';

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
  const userId = getOrCreateUserId();

  const [preferences, setPreferences] = useLocalStorage(
    'weathergpt_dashboard_preferences',
    DEFAULT_SECTION_VISIBILITY
  );

  const [sectionOrder, setSectionOrder] = useLocalStorage(
    'weathergpt_dashboard_order',
    DEFAULT_SECTION_ORDER
  );

  // Sync from backend on initial mount
  useEffect(() => {
    let isMounted = true;
    async function loadRemotePreferences() {
      const remoteData = await fetchDashboardPreferences(userId);
      if (isMounted && remoteData) {
        if (remoteData.visibleSections) {
          setPreferences(remoteData.visibleSections);
        }
        if (remoteData.sectionOrder && Array.isArray(remoteData.sectionOrder)) {
          setSectionOrder(remoteData.sectionOrder);
        }
      }
    }
    loadRemotePreferences();
    return () => { isMounted = false; };
  }, [userId, setPreferences, setSectionOrder]);

  const toggleSection = useCallback((sectionKey) => {
    setPreferences((prev) => {
      const updated = {
        ...prev,
        [sectionKey]: prev[sectionKey] === false ? true : false
      };
      saveDashboardPreferences(userId, {
        visibleSections: updated,
        sectionOrder
      });
      return updated;
    });
  }, [userId, sectionOrder, setPreferences]);

  const moveSection = useCallback((index, direction) => {
    setSectionOrder((prev) => {
      const newOrder = [...prev];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= newOrder.length) return prev;
      
      const temp = newOrder[index];
      newOrder[index] = newOrder[targetIndex];
      newOrder[targetIndex] = temp;

      saveDashboardPreferences(userId, {
        visibleSections: preferences,
        sectionOrder: newOrder
      });

      return newOrder;
    });
  }, [userId, preferences, setSectionOrder]);

  const resetPreferences = useCallback(() => {
    setPreferences(DEFAULT_SECTION_VISIBILITY);
    setSectionOrder(DEFAULT_SECTION_ORDER);
    saveDashboardPreferences(userId, {
      visibleSections: DEFAULT_SECTION_VISIBILITY,
      sectionOrder: DEFAULT_SECTION_ORDER
    });
  }, [userId, setPreferences, setSectionOrder]);

  return {
    preferences,
    sectionOrder,
    toggleSection,
    moveSection,
    resetPreferences,
    isSectionVisible: (key) => preferences[key] !== false
  };
}
