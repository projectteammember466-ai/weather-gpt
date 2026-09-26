// Static Dashboard Section Constants (Dashboard Preferences system removed)

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
  return {
    sectionOrder: DEFAULT_SECTION_ORDER,
    preferences: DEFAULT_SECTION_VISIBILITY,
    isSectionVisible: () => true
  };
}

export default useDashboardPreferences;
