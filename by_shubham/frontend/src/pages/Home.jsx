import React, { useState } from 'react';
import { SearchBar } from '../components/search/SearchBar';
import { WeatherHero } from '../components/weather/WeatherHero';
import { WeatherDetails } from '../components/weather/WeatherDetails';
import { HourlyForecast } from '../components/weather/HourlyForecast';
import { DailyForecast } from '../components/weather/DailyForecast';
import { WeatherChart } from '../components/weather/WeatherChart';
import { AlertDetails } from '../components/alerts/AlertDetails';
import { WeatherSummary } from '../components/chat/WeatherSummary';
import { Loading } from '../components/states/Loading';
import { ErrorMessage } from '../components/states/ErrorMessage';
import { UserContextModeSelector } from '../components/weather/UserContextModeSelector';
import { ClimateSummary } from '../components/weather/ClimateSummary';
import { WeatherMap } from '../components/map/WeatherMap';
import { SuggestedQuestions } from '../components/chat/SuggestedQuestions';
import { SunMoonCard } from '../components/weather/SunMoonCard';
import { SmartWeatherGuidance } from '../components/weather/SmartWeatherGuidance';
import { WeatherTimeline } from '../components/weather/WeatherTimeline';
import { WeatherShareModal } from '../components/weather/WeatherShareModal';
import { useSavedLocations } from '../hooks/useSavedLocations';
import { useDashboardPreferences } from '../hooks/useDashboardPreferences';
import { MapPin, ArrowRight, Star } from 'lucide-react';

export function Home({ 
  weatherState, 
  onNavigateChat, 
  onNavigateMap, 
  onNavigateHistorical, 
  onAskAI, 
  lang = 'en', 
  t = (k, f) => f || k 
}) {
  const {
    city,
    setCity,
    weather,
    forecast,
    alerts,
    climate,
    loading,
    error,
    retry,
    tempUnit,
    windUnit,
    userMode,
    setUserMode,
    mapLayer,
    setMapLayer,
    searchHistory,
    geoState,
    requestLocation
  } = weatherState;

  const [shareModalOpen, setShareModalOpen] = useState(false);
  const { savedLocations, toggleLocation, isSaved } = useSavedLocations();
  const { sectionOrder, isSectionVisible } = useDashboardPreferences();

  return (
    <div className="page-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Search Header Section */}
      <section style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 850, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
          {t('realTimeWeatherIntelligence', 'Real-Time Weather Intelligence')}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '1.25rem' }}>
          {t('searchSubtitle', 'Ask natural questions or search any city to view atmospheric forecasts, interactive maps, and AI insights.')}
        </p>

        <SearchBar
          onSearchCity={setCity}
          onAskAI={onAskAI}
          onRequestLocation={requestLocation}
          geoState={geoState}
          searchHistory={searchHistory}
          t={t}
        />

        {geoState?.message && (
          <p style={{
            fontSize: '0.8rem',
            marginTop: '0.65rem',
            color: geoState.status === 'denied' || geoState.status === 'error' ? '#ef4444' : 'var(--accent-blue)',
            fontWeight: 600
          }}>
            {geoState.message}
          </p>
        )}

        {/* Saved Locations Quick Bar */}
        {savedLocations && savedLocations.length > 0 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            overflowX: 'auto',
            padding: '0.75rem 0 0.25rem 0',
            flexWrap: 'wrap'
          }}>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              <Star size={13} style={{ color: '#f59e0b', fill: '#f59e0b' }} />
              {t('savedLocations', 'Saved')}:
            </span>
            {savedLocations.map((loc) => {
              const locCity = loc.city || loc.name;
              const isCurrent = (city || '').toLowerCase() === locCity.toLowerCase();
              return (
                <button
                  key={locCity}
                  onClick={() => setCity(locCity)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    padding: '0.25rem 0.65rem',
                    borderRadius: 'var(--radius-full)',
                    background: isCurrent ? 'var(--accent-glow)' : 'var(--surface-color)',
                    border: isCurrent ? '1.5px solid var(--accent-blue)' : '1px solid var(--surface-border)',
                    color: isCurrent ? 'var(--accent-blue)' : 'var(--text-secondary)',
                    fontSize: '0.78rem',
                    fontWeight: isCurrent ? 750 : 500,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <span>{loc.name || locCity}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* User Context Mode Selector (8 Modes) */}
        <UserContextModeSelector
          userMode={userMode}
          onSelectMode={setUserMode}
          advice={weather?.contextAdvice}
          lang={lang}
          t={t}
        />
      </section>

      {/* Main Content Area */}
      {loading ? (
        <Loading message={`${t('fetchingWeatherFor', 'Fetching weather data for')} ${city}...`} t={t} />
      ) : error ? (
        <ErrorMessage message={error} onRetry={retry} t={t} />
      ) : weather ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Dynamic Personalized Section Order */}
          {sectionOrder.map((sectionKey) => {
            if (!isSectionVisible(sectionKey)) return null;

            switch (sectionKey) {
              case 'currentWeather':
                return (
                  <section key="currentWeather">
                    <WeatherHero 
                      weather={weather} 
                      tempUnit={tempUnit} 
                      windUnit={windUnit} 
                      onRefresh={retry}
                      isRefreshing={loading}
                      lang={lang}
                      t={t}
                      isSaved={isSaved(weather?.location?.city || city)}
                      onToggleSave={() => toggleLocation(weather?.location || { name: city, city })}
                      onShare={() => setShareModalOpen(true)}
                    />
                  </section>
                );

              case 'weatherDetails':
                return (
                  <section key="weatherDetails">
                    <WeatherDetails current={weather.current} t={t} />
                  </section>
                );

              case 'smartGuidance':
                return (
                  <section key="smartGuidance">
                    <SmartWeatherGuidance 
                      weather={weather}
                      forecast={forecast}
                      userMode={userMode}
                      lang={lang}
                      t={t}
                    />
                  </section>
                );

              case 'weatherTimeline':
                return (
                  <section key="weatherTimeline">
                    <WeatherTimeline 
                      hourly={forecast?.hourly}
                      tempUnit={tempUnit}
                      windUnit={windUnit}
                      userMode={userMode}
                      lang={lang}
                      t={t}
                    />
                  </section>
                );

              case 'weatherChart':
                return (
                  <section key="weatherChart">
                    <WeatherChart hourly={forecast?.hourly} tempUnit={tempUnit} lang={lang} t={t} />
                  </section>
                );

              case 'dailyForecast':
                return (
                  <section key="dailyForecast">
                    <DailyForecast daily={forecast?.daily} tempUnit={tempUnit} lang={lang} t={t} />
                  </section>
                );

              case 'alertsAndSummary':
                return (
                  <section key="alertsAndSummary" className="alerts-summary-grid">
                    <div>
                      <AlertDetails alerts={alerts} city={weather.location.city} t={t} />
                    </div>
                    <div>
                      <WeatherSummary weather={weather} onOpenChat={() => onNavigateChat()} lang={lang} t={t} />
                    </div>
                  </section>
                );

              case 'sunMoon':
                return (
                  <section key="sunMoon">
                    <SunMoonCard 
                      current={weather.current}
                      lang={lang}
                      t={t}
                    />
                  </section>
                );

              case 'weatherMap':
                return (
                  <section key="weatherMap" style={{ marginTop: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                          {t('radarMapTitle', 'Geospatial Weather Radar & Map')}
                        </h2>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                          {t('radarMapSubtitle', 'Interactive weather overlay synchronized with search and dashboard selection.')}
                        </p>
                      </div>
                      <button
                        onClick={onNavigateMap}
                        className="btn-secondary"
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.82rem', gap: '0.35rem', cursor: 'pointer' }}
                      >
                        <span>{t('fullMapView', 'Full Map View')}</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>

                    <WeatherMap
                      selectedCity={city}
                      onSelectCity={setCity}
                      activeLayer={mapLayer}
                      onSelectLayer={setMapLayer}
                      geoCoords={geoState?.coords}
                      location={weather?.location}
                      weather={weather}
                      tempUnit={tempUnit}
                      windUnit={windUnit}
                      lang={lang}
                      t={t}
                    />
                  </section>
                );

              case 'climate':
                return (
                  <section key="climate" style={{ marginTop: '0.5rem' }}>
                    <ClimateSummary 
                      climate={climate} 
                      tempUnit={tempUnit} 
                      onNavigateHistorical={onNavigateHistorical}
                      lang={lang}
                      t={t} 
                    />
                  </section>
                );

              default:
                return null;
            }
          })}

          {/* Suggested Questions (Context & Language Adaptive) */}
          <section className="glass-card" style={{ padding: '1rem 1.25rem' }}>
            <SuggestedQuestions 
              onSelectQuestion={onAskAI} 
              weatherAware={true} 
              userMode={userMode}
              lang={lang}
              t={t}
            />
          </section>

          {/* Weather Share Modal */}
          <WeatherShareModal
            isOpen={shareModalOpen}
            onClose={() => setShareModalOpen(false)}
            weather={weather}
            tempUnit={tempUnit}
            windUnit={windUnit}
            lang={lang}
            t={t}
          />
        </div>
      ) : null}
    </div>
  );
}
