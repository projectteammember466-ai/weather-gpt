import React from 'react';
import { getWeatherIcon } from '../../utils/weatherHelpers';
import { formatTemperature } from '../../utils/formatTemperature';
import { Umbrella } from 'lucide-react';
import { localizeCondition } from '../../data/translations';

export function DailyForecast({ daily = [], tempUnit, lang = 'en', t = (k, f) => f || k }) {
  if (!daily || daily.length === 0) return null;

  return (
    <div className="glass-card" style={{ padding: '1.25rem' }}>
      <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
        {t('sevenDayForecast', '7-Day Forecast')}
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {daily.map((dayItem, idx) => {
          const localizedDay = t(dayItem.day.toLowerCase(), dayItem.day);
          const localizedCond = localizeCondition(dayItem.condition, lang);

          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--surface-color)',
                border: '1px solid var(--surface-border)'
              }}
            >
              <div style={{ width: '90px' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, display: 'block' }}>{localizedDay}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{dayItem.date}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, justifyContent: 'center' }}>
                {getWeatherIcon(dayItem.icon, "w-6 h-6")}
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'none' }} className="sm-show">
                  {localizedCond}
                </span>
              </div>

              {dayItem.rain > 0 && (
                <span style={{ fontSize: '0.75rem', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '0.2rem', width: '60px' }}>
                  <Umbrella size={12} /> {dayItem.rain}%
                </span>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 700, width: '100px', justifyContent: 'flex-end' }}>
                <span style={{ color: '#f87171' }}>{formatTemperature(dayItem.high, tempUnit)}</span>
                <span style={{ color: 'var(--text-muted)' }}>/</span>
                <span style={{ color: '#38bdf8' }}>{formatTemperature(dayItem.low, tempUnit)}</span>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        @media (min-width: 640px) {
          .sm-show { display: inline !important; }
        }
      `}</style>
    </div>
  );
}
