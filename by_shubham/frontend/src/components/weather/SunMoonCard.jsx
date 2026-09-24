import React, { useMemo } from 'react';
import { Sunrise, Sunset, Clock, Moon, Sun, Compass } from 'lucide-react';
import { calculateMoonPhase, calculateSunMetrics } from '../../utils/astronomy';

export function SunMoonCard({ 
  current, 
  lang = 'en', 
  t = (k, f) => f || k 
}) {
  const sunriseStr = current?.sunrise || "06:15 AM";
  const sunsetStr = current?.sunset || "06:45 PM";

  const sunMetrics = useMemo(() => {
    return calculateSunMetrics(sunriseStr, sunsetStr);
  }, [sunriseStr, sunsetStr]);

  const moonData = useMemo(() => {
    return calculateMoonPhase(new Date());
  }, []);

  const localizedMoonPhase = t(moonData.key, moonData.name);

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
            <Sun size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>
              {t('sunMoonTitle', 'Sun & Moon Telemetry')}
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {t('sunMoonSubtitle', 'Solar ephemeris and lunar phase calculations for your location')}
            </span>
          </div>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '0.85rem'
      }}>
        {/* Sunrise Card */}
        <div style={{
          padding: '0.85rem 1rem',
          borderRadius: 'var(--radius-md)',
          background: 'var(--surface-color)',
          border: '1px solid var(--surface-border)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.85rem'
        }}>
          <div style={{
            padding: '0.55rem',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(249, 115, 22, 0.12)',
            color: '#f97316'
          }}>
            <Sunrise size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
              {t('sunrise', 'Sunrise')}
            </span>
            <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {sunMetrics.sunrise}
            </span>
          </div>
        </div>

        {/* Sunset Card */}
        <div style={{
          padding: '0.85rem 1rem',
          borderRadius: 'var(--radius-md)',
          background: 'var(--surface-color)',
          border: '1px solid var(--surface-border)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.85rem'
        }}>
          <div style={{
            padding: '0.55rem',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(168, 85, 247, 0.12)',
            color: '#a855f7'
          }}>
            <Sunset size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
              {t('sunset', 'Sunset')}
            </span>
            <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {sunMetrics.sunset}
            </span>
          </div>
        </div>

        {/* Daylight Duration */}
        <div style={{
          padding: '0.85rem 1rem',
          borderRadius: 'var(--radius-md)',
          background: 'var(--surface-color)',
          border: '1px solid var(--surface-border)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.85rem'
        }}>
          <div style={{
            padding: '0.55rem',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(14, 165, 233, 0.12)',
            color: '#0ea5e9'
          }}>
            <Clock size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
              {t('daylightDuration', 'Daylight Duration')}
            </span>
            <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {sunMetrics.daylightDuration}
            </span>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.1rem' }}>
              {t('solarNoon', 'Solar Noon')}: {sunMetrics.solarNoon}
            </span>
          </div>
        </div>

        {/* Moon Phase */}
        <div style={{
          padding: '0.85rem 1rem',
          borderRadius: 'var(--radius-md)',
          background: 'var(--surface-color)',
          border: '1px solid var(--surface-border)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.85rem'
        }}>
          <div style={{
            fontSize: '1.75rem',
            lineHeight: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '42px',
            height: '42px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--surface-border)'
          }}>
            {moonData.emoji}
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
              {t('moonPhase', 'Moon Phase')}
            </span>
            <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {localizedMoonPhase}
            </span>
            <span style={{ fontSize: '0.68rem', color: 'var(--accent-blue)', display: 'block', marginTop: '0.1rem' }}>
              {t('illumination', 'Illumination')}: {moonData.illumination}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
