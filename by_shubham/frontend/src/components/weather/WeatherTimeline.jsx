import React from 'react';
import { 
  Clock, Sun, CloudRain, Wind, Droplets, Moon, SunMedium, 
  Cloud, CloudLightning, Snowflake, Sparkles, CheckCircle2 
} from 'lucide-react';
import { formatTemperature } from '../../utils/formatTemperature';
import { formatWind } from '../../utils/formatWind';
import { localizeCondition } from '../../data/translations';
import { getContextMode } from '../../data/contextModes';

const CONDITION_ICONS = {
  Sun: Sun,
  SunMedium: SunMedium,
  Cloud: Cloud,
  CloudRain: CloudRain,
  CloudLightning: CloudLightning,
  Snowflake: Snowflake,
  Moon: Moon
};

export function WeatherTimeline({ 
  hourly = [], 
  tempUnit = 'C', 
  windUnit = 'kmh', 
  userMode = 'general', 
  lang = 'en', 
  t = (k, f) => f || k 
}) {
  if (!hourly || hourly.length === 0) return null;

  const modeObj = getContextMode(userMode);
  const modeName = modeObj.names[lang] || modeObj.names.en;

  // Determine period highlight based on context mode
  const getPeriodHighlight = (item) => {
    const rain = item.rainProbability || 0;
    const wind = item.windSpeed || 10;
    const temp = item.temp || 30;
    const timeLower = (item.time || '').toLowerCase();

    if (userMode === 'fitness') {
      if (timeLower.includes('6:00 am') || timeLower.includes('6 am') || timeLower.includes('9:00 pm') || timeLower.includes('9 pm')) {
        return { label: t('optimalWindow', 'Optimal Window'), badge: 'badge-success' };
      }
      if (temp >= 35) {
        return { label: t('cautionWindow', 'High Heat'), badge: 'badge-warning' };
      }
    } else if (userMode === 'farmer') {
      if (rain >= 40) {
        return { label: t('rainPrep', 'Precipitation Window'), badge: 'badge-info' };
      }
      if (wind >= 18) {
        return { label: t('windAdvisory', 'High Wind Window'), badge: 'badge-warning' };
      }
    } else if (userMode === 'outdoor') {
      if (timeLower.includes('12:00 pm') || timeLower.includes('12 pm') || timeLower.includes('03:00 pm') || timeLower.includes('3 pm')) {
        return { label: t('sunProtection', 'Peak Sun Window'), badge: 'badge-warning' };
      }
    } else if (userMode === 'commuter') {
      if (timeLower.includes('9:00 am') || timeLower.includes('9 am') || timeLower.includes('6:00 pm') || timeLower.includes('6 pm')) {
        return { label: t('commuteWindow', 'Transit Window'), badge: 'badge-info' };
      }
    } else if (userMode === 'traveler') {
      if (rain >= 40) {
        return { label: t('cautionWindow', 'Wet Roads Window'), badge: 'badge-warning' };
      }
    }

    return null;
  };

  return (
    <div className="glass-card" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            padding: '0.4rem',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--accent-glow)',
            color: 'var(--accent-blue)'
          }}>
            <Clock size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>
              {t('weatherTimeline', 'Weather Timeline')}
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {t('timelineSubtitle', 'Chronological hourly atmospheric progression and activity windows')} ({modeName})
            </span>
          </div>
        </div>

        <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>
          <Sparkles size={11} /> {t('contextHighlights', 'Context Highlighted')}
        </span>
      </div>

      {/* Horizontal Scrollable Timeline Strip */}
      <div style={{
        display: 'flex',
        gap: '0.75rem',
        overflowX: 'auto',
        paddingBottom: '0.5rem',
        WebkitOverflowScrolling: 'touch'
      }}>
        {hourly.map((item, idx) => {
          const IconComponent = CONDITION_ICONS[item.icon] || Sun;
          const highlight = getPeriodHighlight(item);
          const localizedCond = localizeCondition(item.condition, lang);

          return (
            <div
              key={item.id || idx}
              style={{
                flex: '0 0 auto',
                minWidth: '135px',
                padding: '0.85rem 0.75rem',
                borderRadius: 'var(--radius-md)',
                background: highlight ? 'var(--accent-glow)' : 'var(--surface-color)',
                border: highlight ? '1.5px solid var(--accent-blue)' : '1px solid var(--surface-border)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '0.35rem',
                transition: 'all var(--transition-fast)'
              }}
            >
              <span style={{ fontSize: '0.78rem', fontWeight: 750, color: 'var(--text-secondary)' }}>
                {item.time}
              </span>

              {highlight && (
                <span className={`badge ${highlight.badge}`} style={{ fontSize: '0.62rem', padding: '0.1rem 0.35rem' }}>
                  {highlight.label}
                </span>
              )}

              <div style={{
                padding: '0.35rem',
                borderRadius: 'var(--radius-full)',
                color: 'var(--accent-blue)',
                margin: '0.1rem 0'
              }}>
                <IconComponent size={24} />
              </div>

              <span style={{ fontSize: '1.15rem', fontWeight: 850 }}>
                {formatTemperature(item.temp, tempUnit)}
              </span>

              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                {localizedCond}
              </span>

              {/* Rain Probability */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.2rem',
                fontSize: '0.72rem',
                color: item.rainProbability > 30 ? 'var(--accent-cyan)' : 'var(--text-muted)',
                fontWeight: item.rainProbability > 30 ? 700 : 500,
                marginTop: '0.15rem'
              }}>
                <Droplets size={12} />
                <span>{item.rainProbability ?? 0}%</span>
              </div>

              {/* Wind Speed if available */}
              {item.windSpeed !== undefined && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.2rem',
                  fontSize: '0.68rem',
                  color: 'var(--text-muted)'
                }}>
                  <Wind size={11} />
                  <span>{formatWind(item.windSpeed, windUnit)}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
