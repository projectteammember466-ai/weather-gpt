import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, Sun, Moon, Monitor, Thermometer, Wind, MapPin, 
  Check, Globe, User, Sprout, Plane, AlertTriangle, Bell, ShieldCheck, CheckSquare, Square,
  Car, CalendarCheck, Activity, Star, Trash2, ArrowUp, ArrowDown, RotateCcw,
  Sliders, Compass, Sparkles, ExternalLink, Key, Bot, CloudLightning
} from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../data/translations';
import { CONTEXT_MODES } from '../data/contextModes';
import { useSavedLocations } from '../hooks/useSavedLocations';
import { useDashboardPreferences } from '../hooks/useDashboardPreferences';
import { getGeminiApiKey, setGeminiApiKey, getOpenWeatherApiKey, setOpenWeatherApiKey, DEFAULT_GEMINI_KEY } from '../services/geminiService';
import { getGoogleMapsApiKey, setGoogleMapsApiKey, DEFAULT_GOOGLE_MAPS_KEY } from '../services/api';

const MODE_ICONS = {
  general: User,
  farmer: Sprout,
  traveler: Plane,
  outdoor: Sun,
  emergency: AlertTriangle,
  commuter: Car,
  event_planner: CalendarCheck,
  fitness: Activity
};

export function Settings({
  theme,
  setTheme,
  tempUnit,
  setTempUnit,
  windUnit,
  setWindUnit,
  city,
  onSelectCity,
  onRequestLocation,
  geoState,
  userMode,
  setUserMode,
  lang,
  setLang,
  alertPreferences,
  setAlertPreferences,
  t = (k, f) => f || k,
  onNavigate
}) {
  const { savedLocations, removeLocation } = useSavedLocations();
  const { 
    preferences, 
    sectionOrder, 
    toggleSection, 
    moveSection, 
    resetPreferences, 
    isSectionVisible 
  } = useDashboardPreferences();

  const [geminiKeyInput, setGeminiKeyInput] = useState(getGeminiApiKey());
  const [openWeatherKeyInput, setOpenWeatherKeyInput] = useState(getOpenWeatherApiKey());
  const [googleMapsKeyInput, setGoogleMapsKeyInput] = useState(getGoogleMapsApiKey());
  const [keySavedMessage, setKeySavedMessage] = useState('');

  const handleSaveKeys = (e) => {
    e.preventDefault();
    setGeminiApiKey(geminiKeyInput);
    setOpenWeatherApiKey(openWeatherKeyInput);
    setGoogleMapsApiKey(googleMapsKeyInput);
    setKeySavedMessage(t('keysSaved', 'API Keys saved successfully!'));
    setTimeout(() => setKeySavedMessage(''), 3000);
  };

  const handleResetDefaultGemini = () => {
    setGeminiKeyInput(DEFAULT_GEMINI_KEY);
    setGeminiApiKey(DEFAULT_GEMINI_KEY);
    setKeySavedMessage(t('geminiReset', 'Reset to default Gemini API key!'));
    setTimeout(() => setKeySavedMessage(''), 3000);
  };

  const handleResetDefaultGoogleMaps = () => {
    setGoogleMapsKeyInput(DEFAULT_GOOGLE_MAPS_KEY);
    setGoogleMapsApiKey(DEFAULT_GOOGLE_MAPS_KEY);
    setKeySavedMessage(t('googleMapsReset', 'Reset to default Google Maps API key!'));
    setTimeout(() => setKeySavedMessage(''), 3000);
  };

  const SECTION_LABELS = {
    currentWeather: t('sectionCurrentWeather', 'Current Weather & Hero'),
    weatherDetails: t('sectionWeatherDetails', 'Weather Details & Telemetry'),
    smartGuidance: t('sectionSmartGuidance', 'Smart Weather Guidance'),
    weatherTimeline: t('weatherTimeline', 'Weather Timeline & Hourly Forecast'),
    weatherChart: t('sectionWeatherChart', '24-Hour Temperature Chart'),
    dailyForecast: t('sectionDailyForecast', '7-Day Daily Forecast'),
    alertsAndSummary: t('sectionAlerts', 'Active Weather Alerts & AI Summary'),
    sunMoon: t('sectionSunMoon', 'Sun & Moon Telemetry'),
    weatherMap: t('sectionWeatherMap', 'Interactive Radar & Weather Map'),
    climate: t('sectionClimate', 'Climate & Historical Trends')
  };
  const themeOptions = [
    { id: 'system', label: t('themeSystem', 'System Default'), icon: Monitor },
    { id: 'light', label: t('themeLight', 'Light Mode'), icon: Sun },
    { id: 'dark', label: t('themeDark', 'Dark Mode'), icon: Moon }
  ];

  const alertCategories = [
    { id: 'heavyRain', label: t('alertHeavyRain', 'Heavy Rain & Flooding') },
    { id: 'thunderstorm', label: t('alertThunderstorm', 'Thunderstorms & Lightning') },
    { id: 'extremeHeat', label: t('alertExtremeHeat', 'Extreme Heat & Heatwave') },
    { id: 'strongWind', label: t('alertStrongWind', 'High Winds & Gales') },
    { id: 'poorAQI', label: t('alertPoorAQI', 'Hazardous Air Quality (AQI)') },
    { id: 'extremeCold', label: t('alertExtremeCold', 'Freezing Ice & Cold Wave') }
  ];

  const frequencyOptions = [
    { id: 'immediate', label: t('freqImmediate', 'Immediately') },
    { id: 'important', label: t('freqImportant', 'Important Only') },
    { id: 'daily', label: t('freqDaily', 'Daily Digest') }
  ];

  const isGeoRequesting = geoState?.status === 'requesting';

  const toggleAlertType = (key) => {
    setAlertPreferences(prev => ({
      ...prev,
      types: {
        ...prev.types,
        [key]: !prev.types[key]
      }
    }));
  };

  const setFrequency = (freq) => {
    setAlertPreferences(prev => ({
      ...prev,
      frequency: freq
    }));
  };

  return (
    <div className="page-fade-in" style={{ maxWidth: '850px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <SettingsIcon size={26} style={{ color: 'var(--accent-blue)' }} />
        <h1 style={{ fontSize: '1.75rem', fontWeight: 850 }}>
          {t('appPreferences', 'App Preferences & Settings')}
        </h1>
      </div>

      {/* Language / भाषा */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
          <Globe size={18} style={{ color: 'var(--accent-blue)' }} />
          <h2 style={{ fontSize: '1.1rem', fontWeight: 750 }}>
            {t('language', 'Language')} / {t('bhasha', 'भाषा')}
          </h2>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>
          {t('languageDesc', 'Choose your application interface language. Translates navigation, cards, alerts, forecasts, and AI assistance.')}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
          {SUPPORTED_LANGUAGES.map((l) => {
            const isSelected = lang === l.id;
            return (
              <button
                key={l.id}
                onClick={() => setLang(l.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: isSelected ? 'var(--accent-glow)' : 'var(--surface-color)',
                  border: isSelected ? '2px solid var(--accent-blue)' : '1px solid var(--surface-border)',
                  fontWeight: isSelected ? 750 : 500,
                  color: isSelected ? 'var(--accent-blue)' : 'var(--text-primary)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <div>
                  <span style={{ fontWeight: 800, display: 'block' }}>{l.native}</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{l.label}</span>
                </div>
                {isSelected && <Check size={16} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* User Context Modes - 8 Profiles */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
          <User size={18} style={{ color: 'var(--accent-indigo)' }} />
          <h2 style={{ fontSize: '1.1rem', fontWeight: 750 }}>
            {t('contextModes', 'User Context Modes')} (8 {t('profiles', 'Profiles')})
          </h2>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>
          {t('contextModesDesc', 'Select your activity persona. Customizes dashboard metric prioritization, advice, and WeatherGPT AI perspectives.')}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '0.75rem' }}>
          {CONTEXT_MODES.map((m) => {
            const Icon = MODE_ICONS[m.id] || User;
            const isSelected = userMode === m.id;
            const modeName = m.names[lang] || m.names.en;
            const modeDesc = m.descriptions[lang] || m.descriptions.en;

            return (
              <button
                key={m.id}
                onClick={() => setUserMode(m.id)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: isSelected ? 'var(--accent-glow)' : 'var(--surface-color)',
                  border: isSelected ? '2px solid var(--accent-blue)' : '1px solid var(--surface-border)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '0.35rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, color: isSelected ? 'var(--accent-blue)' : 'var(--text-primary)' }}>
                    <Icon size={16} />
                    <span>{modeName}</span>
                  </div>
                  {isSelected && <Check size={16} style={{ color: 'var(--accent-blue)' }} />}
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  {modeDesc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Smart Alert Preferences */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
          <Bell size={18} style={{ color: '#ef4444' }} />
          <h2 style={{ fontSize: '1.1rem', fontWeight: 750 }}>
            {t('alertPreferences', 'Smart Alert Preferences')}
          </h2>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>
          {t('alertPreferencesDesc', 'Customize which weather warnings matter to you and notification urgency.')}
        </p>

        {/* Alert Type Checkboxes */}
        <div style={{ marginBottom: '1.25rem' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
            {t('activeCategories', 'Active Categories')}:
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.5rem' }}>
            {alertCategories.map((cat) => {
              const isChecked = alertPreferences?.types?.[cat.id] ?? true;
              return (
                <div
                  key={cat.id}
                  onClick={() => toggleAlertType(cat.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--surface-color)',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    color: isChecked ? 'var(--text-primary)' : 'var(--text-muted)',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  {isChecked ? (
                    <CheckSquare size={16} style={{ color: 'var(--accent-blue)' }} />
                  ) : (
                    <Square size={16} style={{ color: 'var(--text-muted)' }} />
                  )}
                  <span>{cat.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Frequency Choice */}
        <div>
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
            {t('notificationFrequency', 'Notification Frequency')}:
          </span>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {frequencyOptions.map((f) => {
              const isSelected = alertPreferences?.frequency === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setFrequency(f.id)}
                  className={isSelected ? 'btn-primary' : 'btn-secondary'}
                  style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Theme Settings */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 750, marginBottom: '0.5rem' }}>
          {t('appearance', 'Theme & Visual Atmosphere')}
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>
          {t('themeDesc', 'Choose your preferred color theme or match your operating system.')}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
          {themeOptions.map((opt) => {
            const Icon = opt.icon;
            const isSelected = theme === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setTheme(opt.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: isSelected ? 'var(--accent-glow)' : 'var(--surface-color)',
                  border: isSelected ? '2px solid var(--accent-blue)' : '1px solid var(--surface-border)',
                  fontWeight: isSelected ? 750 : 500,
                  color: isSelected ? 'var(--accent-blue)' : 'var(--text-primary)',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Icon size={18} />
                  <span>{opt.label}</span>
                </div>
                {isSelected && <Check size={16} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Units Settings */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 750, marginBottom: '0.5rem' }}>
          {t('measurementUnits', 'Units of Measurement')}
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
          {t('unitsDesc', 'Configure display units for temperature and wind velocity.')}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Temperature Unit */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Thermometer size={18} style={{ color: 'var(--accent-blue)' }} />
              <span style={{ fontWeight: 600, fontSize: '0.92rem' }}>
                {t('temperatureUnit', 'Temperature Unit')}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => setTempUnit('C')}
                className={tempUnit === 'C' ? 'btn-primary' : 'btn-secondary'}
                style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
              >
                {t('celsius', 'Celsius')} (°C)
              </button>
              <button
                onClick={() => setTempUnit('F')}
                className={tempUnit === 'F' ? 'btn-primary' : 'btn-secondary'}
                style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
              >
                {t('fahrenheit', 'Fahrenheit')} (°F)
              </button>
            </div>
          </div>

          {/* Wind Unit */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', paddingTop: '1rem', borderTop: '1px solid var(--surface-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Wind size={18} style={{ color: 'var(--accent-cyan)' }} />
              <span style={{ fontWeight: 600, fontSize: '0.92rem' }}>
                {t('windSpeedUnit', 'Wind Speed Unit')}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => setWindUnit('kmh')}
                className={windUnit === 'kmh' ? 'btn-primary' : 'btn-secondary'}
                style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
              >
                km/h
              </button>
              <button
                onClick={() => setWindUnit('mph')}
                className={windUnit === 'mph' ? 'btn-primary' : 'btn-secondary'}
                style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
              >
                mph
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Location Configuration */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 750, marginBottom: '0.5rem' }}>
          {t('locationSettings', 'Location & Geolocation')}
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>
          {t('activeStation', 'Active station')}: <strong>{city ? city.charAt(0).toUpperCase() + city.slice(1) : t('notSet', 'Not set')}</strong>
        </p>

        <button 
          onClick={onRequestLocation} 
          disabled={isGeoRequesting}
          className="btn-secondary" 
          style={{ gap: '0.5rem' }}
        >
          <MapPin size={16} style={{ color: 'var(--accent-blue)' }} />
          <span>
            {isGeoRequesting 
              ? t('detectingCoordinates', 'Detecting coordinates...') 
              : t('updateViaGeolocation', 'Update via Browser Geolocation')}
          </span>
        </button>

        {geoState?.message && (
          <p style={{
            fontSize: '0.82rem',
            marginTop: '0.75rem',
            color: geoState.status === 'denied' || geoState.status === 'error' ? '#ef4444' : 'var(--accent-blue)',
            fontWeight: 600
          }}>
            {geoState.message}
          </p>
        )}
      </div>

      {/* Saved Locations Management */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <Star size={18} style={{ color: '#f59e0b', fill: '#f59e0b' }} />
            <h2 style={{ fontSize: '1.1rem', fontWeight: 750 }}>
              {t('savedLocations', 'Saved Locations')} ({savedLocations.length})
            </h2>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {t('quickSavedCities', 'Quick Access Cities')}
          </span>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
          {t('noSavedLocationsDesc', 'Star or save your favorite cities for one-click weather tracking across the dashboard.')}
        </p>

        {savedLocations.length === 0 ? (
          <div style={{
            padding: '1.5rem',
            textAlign: 'center',
            background: 'var(--surface-color)',
            borderRadius: 'var(--radius-md)',
            border: '1px dashed var(--surface-border)',
            color: 'var(--text-muted)',
            fontSize: '0.88rem'
          }}>
            {t('noSavedLocations', 'No Saved Locations')} — {t('saveLocation', 'Save Location')} from the search bar or dashboard.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {savedLocations.map((loc) => (
              <div
                key={loc.city || loc.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--surface-color)',
                  border: '1px solid var(--surface-border)',
                  flexWrap: 'wrap',
                  gap: '0.5rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <MapPin size={16} style={{ color: 'var(--accent-blue)' }} />
                  <div>
                    <span style={{ fontWeight: 750, fontSize: '0.92rem', display: 'block', color: 'var(--text-primary)' }}>
                      {loc.displayName || loc.name}
                    </span>
                    {(loc.latitude && loc.longitude) && (
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {Number(loc.latitude).toFixed(2)}°N, {Number(loc.longitude).toFixed(2)}°E
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {onSelectCity && (
                    <button
                      onClick={() => {
                        onSelectCity(loc.city || loc.name);
                        if (onNavigate) onNavigate('dashboard');
                      }}
                      className="btn-secondary"
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
                    >
                      {t('viewDetails', 'View Weather')}
                    </button>
                  )}
                  <button
                    onClick={() => removeLocation(loc.city || loc.name)}
                    aria-label={`Remove ${loc.name} from saved locations`}
                    title={t('removeSaved', 'Remove from Saved')}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: '0.4rem',
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'color var(--transition-fast)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dashboard Preferences & Personalization */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <Sliders size={18} style={{ color: 'var(--accent-blue)' }} />
            <h2 style={{ fontSize: '1.1rem', fontWeight: 750 }}>
              {t('dashboardPreferences', 'Dashboard Preferences')}
            </h2>
          </div>
          <button
            onClick={resetPreferences}
            className="btn-secondary"
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <RotateCcw size={13} />
            <span>{t('resetOrder', 'Reset Default Order')}</span>
          </button>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
          {t('dashboardPreferencesDesc', 'Choose which sections are displayed on your dashboard and customize their order.')}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {sectionOrder.map((sectionKey, index) => {
            const isVisible = isSectionVisible(sectionKey);
            const label = SECTION_LABELS[sectionKey] || sectionKey;
            const isFirst = index === 0;
            const isLast = index === sectionOrder.length - 1;

            return (
              <div
                key={sectionKey}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  background: isVisible ? 'var(--surface-color)' : 'rgba(0,0,0,0.03)',
                  border: '1px solid var(--surface-border)',
                  opacity: isVisible ? 1 : 0.65,
                  transition: 'all var(--transition-fast)'
                }}
              >
                <div 
                  onClick={() => toggleSection(sectionKey)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer', flex: 1 }}
                >
                  {isVisible ? (
                    <CheckSquare size={17} style={{ color: 'var(--accent-blue)', flexShrink: 0 }} />
                  ) : (
                    <Square size={17} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                  )}
                  <span style={{
                    fontSize: '0.88rem',
                    fontWeight: isVisible ? 650 : 450,
                    color: isVisible ? 'var(--text-primary)' : 'var(--text-muted)'
                  }}>
                    {label}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <button
                    onClick={() => moveSection(index, 'up')}
                    disabled={isFirst}
                    aria-label={`Move ${label} up`}
                    title={t('moveUp', 'Move Up')}
                    style={{
                      background: 'transparent',
                      border: '1px solid var(--surface-border)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.3rem',
                      cursor: isFirst ? 'not-allowed' : 'pointer',
                      opacity: isFirst ? 0.3 : 1,
                      color: 'var(--text-secondary)',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    onClick={() => moveSection(index, 'down')}
                    disabled={isLast}
                    aria-label={`Move ${label} down`}
                    title={t('moveDown', 'Move Down')}
                    style={{
                      background: 'transparent',
                      border: '1px solid var(--surface-border)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.3rem',
                      cursor: isLast ? 'not-allowed' : 'pointer',
                      opacity: isLast ? 0.3 : 1,
                      color: 'var(--text-secondary)',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <ArrowDown size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI & Weather API Keys Configuration Card */}
      <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.35rem' }}>
            <Key size={18} style={{ color: 'var(--accent-blue)' }} />
            <h2 style={{ fontSize: '1.1rem', fontWeight: 750 }}>
              {t('apiKeysTitle', 'AI Engine & Weather API Keys')}
            </h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0, lineHeight: 1.4 }}>
            {t('apiKeysSubtitle', 'Configure Google Gemini for conversational function calling and OpenWeather. Open-Meteo telemetry functions globally without an API key.')}
          </p>
        </div>

        <form onSubmit={handleSaveKeys} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Gemini API Key */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Bot size={15} style={{ color: 'var(--accent-blue)' }} />
              <span>Google Gemini API Key</span>
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <input
                type="text"
                value={geminiKeyInput}
                onChange={(e) => setGeminiKeyInput(e.target.value)}
                placeholder="Enter Google Gemini API Key"
                style={{
                  flex: 1,
                  minWidth: '260px',
                  padding: '0.55rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--surface-color)',
                  border: '1px solid var(--surface-border)',
                  fontSize: '0.85rem',
                  fontFamily: 'monospace',
                  color: 'var(--text-primary)'
                }}
              />
              <button
                type="button"
                onClick={handleResetDefaultGemini}
                style={{
                  padding: '0.55rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--surface-color)',
                  border: '1px solid var(--surface-border)',
                  color: 'var(--text-secondary)',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                {t('resetDefault', 'Reset Default')}
              </button>
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              {t('geminiKeyHint', 'Powers function calling (get_weather_report). If rate-limited or denied, WeatherGPT automatically falls back to live satellite telemetry.')}
            </span>
          </div>

          {/* OpenWeather API Key */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <CloudLightning size={15} style={{ color: '#eab308' }} />
              <span>OpenWeather API Key ({t('optional', 'Optional')})</span>
            </label>
            <input
              type="text"
              value={openWeatherKeyInput}
              onChange={(e) => setOpenWeatherKeyInput(e.target.value)}
              placeholder="e.g. 1a2b3c4d5e6f... (optional)"
              style={{
                padding: '0.55rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--surface-color)',
                border: '1px solid var(--surface-border)',
                fontSize: '0.85rem',
                fontFamily: 'monospace',
                color: 'var(--text-primary)'
              }}
            />
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              {t('openWeatherHint', 'If empty, real-time Open-Meteo satellite observations & WMO telemetry are used without requiring any key.')}
            </span>
          </div>

          {/* Google Maps API Key */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <MapPin size={15} style={{ color: 'var(--accent-blue)' }} />
              <span>Google Maps API Key</span>
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <input
                type="text"
                value={googleMapsKeyInput}
                onChange={(e) => setGoogleMapsKeyInput(e.target.value)}
                placeholder="Enter Google Maps API Key"
                style={{
                  flex: 1,
                  minWidth: '260px',
                  padding: '0.55rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--surface-color)',
                  border: '1px solid var(--surface-border)',
                  fontSize: '0.85rem',
                  fontFamily: 'monospace',
                  color: 'var(--text-primary)'
                }}
              />
              <button
                type="button"
                onClick={handleResetDefaultGoogleMaps}
                style={{
                  padding: '0.55rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--surface-color)',
                  border: '1px solid var(--surface-border)',
                  color: 'var(--text-secondary)',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                {t('resetDefault', 'Reset Default')}
              </button>
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              {t('googleMapsHint', 'Powers high-resolution Google Maps Roadmap, Satellite Hybrid, and Terrain layers on the radar map.')}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.25rem' }}>
            <button
              type="submit"
              className="btn-primary"
              style={{ padding: '0.55rem 1.25rem', fontSize: '0.85rem' }}
            >
              {t('saveKeys', 'Save API Keys')}
            </button>
            {keySavedMessage && (
              <span style={{ fontSize: '0.82rem', color: '#10b981', fontWeight: 650, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Check size={14} /> {keySavedMessage}
              </span>
            )}
          </div>
        </form>
      </div>

      {/* How WeatherGPT Works Card */}
      <div className="glass-card" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, var(--surface-card), var(--surface-color))' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.35rem' }}>
              <Sparkles size={18} style={{ color: 'var(--accent-blue)' }} />
              <h2 style={{ fontSize: '1.1rem', fontWeight: 750 }}>
                {t('howWeatherGPTWorks', 'How WeatherGPT Works')}
              </h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0, lineHeight: 1.4 }}>
              {t('howWeatherGPTWorksSubtitle', 'See how WeatherGPT turns a weather question into a grounded response.')}
            </p>
          </div>
          {onNavigate && (
            <button
              onClick={() => onNavigate('pipeline')}
              className="btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 1rem', fontSize: '0.85rem' }}
            >
              <span>{t('viewPipeline', 'Explore 8-Stage Architecture')}</span>
              <ExternalLink size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
