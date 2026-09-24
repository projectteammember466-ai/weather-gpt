import React, { useState } from 'react';
import { getWeatherIcon } from '../../utils/weatherHelpers';
import { formatTemperature } from '../../utils/formatTemperature';
import { formatWind } from '../../utils/formatWind';
import { MapPin, Droplets, Wind, Umbrella, ArrowUp, ArrowDown, Clock, HelpCircle, ShieldCheck, RefreshCw, Star, Share2 } from 'lucide-react';
import { ConfidenceBadge } from './ConfidenceBadge';
import { FreshnessBadge } from './FreshnessBadge';
import { WhyForecastPanel } from './WhyForecastPanel';
import { localizeCondition } from '../../data/translations';

export function WeatherHero({ 
  weather, 
  tempUnit, 
  windUnit, 
  onRefresh, 
  isRefreshing = false, 
  lang = 'en', 
  t = (k, f) => f || k,
  isSaved = false,
  onToggleSave,
  onShare
}) {
  const [showWhyPanel, setShowWhyPanel] = useState(false);
  const [localSpinning, setLocalSpinning] = useState(false);

  if (!weather) return null;

  const { location, current, metadata, confidence, whyForecast } = weather;
  const conditionDisplay = localizeCondition(current.condition, lang);

  const handleRefresh = async () => {
    setLocalSpinning(true);
    if (onRefresh) {
      try {
        await onRefresh();
      } catch (err) {
        console.error(err);
      }
    }
    setTimeout(() => setLocalSpinning(false), 700);
  };

  const isSpinning = isRefreshing || localSpinning;

  return (
    <>
      <div className="glass-card" style={{
        padding: '2rem',
        position: 'relative',
        overflow: 'hidden',
        borderColor: 'rgba(56, 189, 248, 0.2)'
      }}>
        {/* Location, Freshness, Confidence & Refresh Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div style={{ maxWidth: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <MapPin size={20} style={{ color: 'var(--accent-blue)', flexShrink: 0 }} />
              <h1 style={{
                fontSize: '1.75rem',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                wordBreak: 'break-word',
                overflowWrap: 'break-word'
              }}>
                {location.city}
              </h1>
              {onToggleSave && (
                <button
                  onClick={onToggleSave}
                  title={isSaved ? t('saved', 'Saved') : t('saveLocation', 'Save Location')}
                  aria-label={isSaved ? "Remove from saved locations" : "Save location to favorites"}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.2rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'transform var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.15)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <Star
                    size={22}
                    style={{
                      color: isSaved ? '#f59e0b' : 'var(--text-muted)',
                      fill: isSaved ? '#f59e0b' : 'transparent',
                      transition: 'all var(--transition-fast)'
                    }}
                  />
                </button>
              )}
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginLeft: '1.65rem' }}>
              {location.region}{location.region && location.country ? ', ' : ''}{location.country}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <FreshnessBadge metadata={metadata} t={t} />
            <ConfidenceBadge confidence={confidence} t={t} />
            
            {/* Share Weather Snapshot */}
            {onShare && (
              <button
                onClick={onShare}
                aria-label={t('shareWeather', 'Share Weather')}
                title={t('shareWeather', 'Share Weather')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.3rem 0.65rem',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--surface-color)',
                  border: '1px solid var(--surface-border)',
                  fontSize: '0.75rem',
                  color: 'var(--text-secondary)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--accent-blue)';
                  e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--text-secondary)';
                  e.currentTarget.style.borderColor = 'var(--surface-border)';
                }}
              >
                <Share2 size={12} style={{ color: 'var(--accent-blue)' }} />
                <span>{t('shareWeather', 'Share')}</span>
              </button>
            )}

            {/* Subtle Refresh Affordance */}
            <button
              onClick={handleRefresh}
              disabled={isSpinning}
              aria-label={t('refreshWeatherData', 'Refresh weather data')}
              title={t('refreshWeatherData', 'Refresh weather data')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.3rem 0.65rem',
                borderRadius: 'var(--radius-full)',
                background: 'var(--surface-color)',
                border: '1px solid var(--surface-border)',
                fontSize: '0.75rem',
                color: isSpinning ? 'var(--accent-blue)' : 'var(--text-secondary)',
                fontWeight: 600,
                cursor: isSpinning ? 'not-allowed' : 'pointer',
                transition: 'all var(--transition-fast)'
              }}
              onMouseEnter={(e) => {
                if (!isSpinning) {
                  e.currentTarget.style.color = 'var(--accent-blue)';
                  e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSpinning) {
                  e.currentTarget.style.color = 'var(--text-secondary)';
                  e.currentTarget.style.borderColor = 'var(--surface-border)';
                }
              }}
            >
              <RefreshCw 
                size={12} 
                style={{
                  animation: isSpinning ? 'spin 0.75s linear infinite' : 'none'
                }} 
              />
              <span>{t('refresh', 'Refresh')}</span>
            </button>
          </div>
        </div>

        {/* Main Temperature Hero Display */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem',
          marginBottom: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            <div style={{
              padding: '1rem',
              borderRadius: 'var(--radius-xl)',
              background: 'var(--accent-glow)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {getWeatherIcon(current.icon, "w-16 h-16")}
            </div>

            <div>
              <div style={{ fontSize: '3.75rem', fontWeight: 800, lineHeight: 1, letterSpacing: '-0.03em' }}>
                {formatTemperature(current.temperature, tempUnit)}
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-secondary)', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span>{conditionDisplay}</span>
                {current.rainProbability > 0 && (
                  <span className="badge badge-info" style={{ textTransform: 'none', padding: '0.2rem 0.5rem' }}>
                    <Umbrella size={12} /> {current.rainProbability}% {t('rainChance', 'rain')}
                  </span>
                )}
                {/* Why This Forecast trigger */}
                {whyForecast && (
                  <button
                    onClick={() => setShowWhyPanel(true)}
                    className="btn-secondary"
                    style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem', gap: '0.25rem', borderRadius: 'var(--radius-full)' }}
                    title={t('viewMeteorologicalReasoning', 'Click to view meteorological reasoning signals')}
                  >
                    <HelpCircle size={12} style={{ color: 'var(--accent-blue)' }} />
                    <span>{t('whyForecast', 'Why this forecast?')}</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Highlights Stack */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
            gap: '0.85rem',
            minWidth: '220px',
            flex: 1
          }}>
            {current.feelsLike !== undefined && (
              <div style={{ background: 'var(--surface-color)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>{t('feelsLike', 'Feels Like')}</span>
                <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>{formatTemperature(current.feelsLike, tempUnit)}</span>
              </div>
            )}

            {(current.highTemp !== undefined || current.lowTemp !== undefined) && (
              <div style={{ background: 'var(--surface-color)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>{t('highLow', 'High / Low')}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.95rem', fontWeight: 700 }}>
                  {current.highTemp !== undefined && (
                    <span style={{ color: '#f87171', display: 'inline-flex', alignItems: 'center' }}>
                      <ArrowUp size={12} /> {formatTemperature(current.highTemp, tempUnit)}
                    </span>
                  )}
                  {current.highTemp !== undefined && current.lowTemp !== undefined && <span>/</span>}
                  {current.lowTemp !== undefined && (
                    <span style={{ color: '#38bdf8', display: 'inline-flex', alignItems: 'center' }}>
                      <ArrowDown size={12} /> {formatTemperature(current.lowTemp, tempUnit)}
                    </span>
                  )}
                </div>
              </div>
            )}

            {current.humidity !== undefined && (
              <div style={{ background: 'var(--surface-color)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Droplets size={16} style={{ color: '#38bdf8' }} />
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>{t('humidity', 'Humidity')}</span>
                  <span style={{ fontSize: '0.95rem', fontWeight: 700 }}>{current.humidity}%</span>
                </div>
              </div>
            )}

            {current.windSpeed !== undefined && (
              <div style={{ background: 'var(--surface-color)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Wind size={16} style={{ color: '#06b6d4' }} />
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>{t('wind', 'Wind')}</span>
                  <span style={{ fontSize: '0.95rem', fontWeight: 700 }}>{formatWind(current.windSpeed, windUnit, current.windDirection)}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Source Attribution footer strip */}
        <div style={{
          borderTop: '1px solid var(--surface-border)',
          paddingTop: '0.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.72rem',
          color: 'var(--text-muted)',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}>
          <div>
            {t('source', 'Source')}: <strong style={{ color: 'var(--text-secondary)' }}>{metadata.source}</strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--accent-blue)' }}>
            <ShieldCheck size={12} />
            <span>{t('trustVerified', 'WeatherGPT Trust Verified Architecture')}</span>
          </div>
        </div>
      </div>

      {/* Why This Forecast Modal */}
      {showWhyPanel && (
        <WhyForecastPanel
          whyForecast={whyForecast}
          city={location.city}
          onClose={() => setShowWhyPanel(false)}
          t={t}
        />
      )}
    </>
  );
}
