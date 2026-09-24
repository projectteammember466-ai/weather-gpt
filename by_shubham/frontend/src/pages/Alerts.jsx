import React, { useState } from 'react';
import { AlertDetails } from '../components/alerts/AlertDetails';
import { ShieldAlert, Info, Filter, Bell } from 'lucide-react';

export function Alerts({ alerts = [], city = "", alertPreferences, onNavigateSettings, t = (k, f) => f || k }) {
  const [selectedSeverity, setSelectedSeverity] = useState('ALL');

  const severities = ['ALL', 'EXTREME', 'SEVERE', 'HIGH', 'WATCH', 'ADVISORY', 'INFO'];

  const filteredAlerts = selectedSeverity === 'ALL'
    ? alerts
    : alerts.filter(a => a.severity.toUpperCase() === selectedSeverity);

  return (
    <div className="page-fade-in" style={{ maxWidth: '850px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <ShieldAlert size={28} style={{ color: '#ef4444' }} />
            <h1 style={{ fontSize: '1.75rem', fontWeight: 850 }}>
              {t('alertCenterTitle', 'Weather Alert Center')}
            </h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {t('alertCenterSubtitle', 'Official meteorological warnings and AI impact interpretations for')} {city || t('yourRegion', 'your region')}.
          </p>
        </div>

        {onNavigateSettings && (
          <button
            onClick={onNavigateSettings}
            className="btn-secondary"
            style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', gap: '0.35rem', cursor: 'pointer' }}
          >
            <Bell size={14} style={{ color: 'var(--accent-blue)' }} />
            <span>{t('alertPreferences', 'Alert Preferences')}</span>
          </button>
        )}
      </div>

      <div className="glass-card" style={{
        padding: '1rem',
        marginBottom: '1.5rem',
        borderColor: 'rgba(56, 189, 248, 0.25)',
        background: 'rgba(56, 189, 248, 0.05)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        fontSize: '0.82rem',
        color: 'var(--text-secondary)'
      }}>
        <Info size={18} style={{ color: 'var(--accent-blue)', flexShrink: 0 }} />
        <span>
          <strong>{t('trustPolicy', 'Trust Policy')}:</strong> {t('trustPolicyAlerts', 'WeatherGPT strictly separates official government warnings from AI explanations. AI assessments provide educational guidance and should never supersede civil defense directives.')}
        </span>
      </div>

      {/* Severity Filter */}
      {alerts.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, marginRight: '0.25rem' }}>
            <Filter size={14} /> {t('filter', 'Filter')}:
          </div>
          {severities.map((sev) => {
            const isSelected = selectedSeverity === sev;
            const label = sev === 'ALL' ? t('all', 'ALL') : t(sev.toLowerCase(), sev);
            return (
              <button
                key={sev}
                onClick={() => setSelectedSeverity(sev)}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  background: isSelected ? 'var(--accent-glow)' : 'var(--surface-color)',
                  color: isSelected ? 'var(--accent-blue)' : 'var(--text-secondary)',
                  border: isSelected ? '1px solid var(--accent-blue)' : '1px solid var(--surface-border)',
                  cursor: 'pointer'
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}

      <AlertDetails alerts={filteredAlerts} city={city} t={t} />
    </div>
  );
}
