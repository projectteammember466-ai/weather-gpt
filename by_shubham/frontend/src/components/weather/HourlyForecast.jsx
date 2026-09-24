import React from 'react';
import { getWeatherIcon } from '../../utils/weatherHelpers';
import { formatTemperature } from '../../utils/formatTemperature';
import { Umbrella } from 'lucide-react';

export function HourlyForecast({ hourly = [], tempUnit, t = (k, f) => f || k }) {
  if (!hourly || hourly.length === 0) return null;

  return (
    <div style={{ marginTop: '1.5rem' }}>
      <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
        {t('hourlyForecast', 'Hourly Forecast')}
      </h2>
      <div 
        className="glass-card"
        style={{
          padding: '1.25rem 1rem',
          display: 'flex',
          gap: '1rem',
          overflowX: 'auto',
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {hourly.map((item) => (
          <div
            key={item.id}
            style={{
              flex: '0 0 90px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.85rem 0.5rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--surface-color)',
              border: '1px solid var(--surface-border)',
              minHeight: '135px'
            }}
          >
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              {item.time === 'Now' ? t('now', 'Now') : item.time}
            </span>
            
            <div style={{ margin: '0.5rem 0' }}>
              {getWeatherIcon(item.icon, "w-8 h-8")}
            </div>

            <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>
              {formatTemperature(item.temp, tempUnit)}
            </span>

            {item.rainProbability > 0 && (
              <span style={{ fontSize: '0.7rem', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '2px', marginTop: '0.2rem' }}>
                <Umbrella size={10} /> {item.rainProbability}%
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
