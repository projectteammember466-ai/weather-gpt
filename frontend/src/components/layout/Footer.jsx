import React from 'react';
import { CloudSun, AlertTriangle, ShieldCheck } from 'lucide-react';

export function Footer({ t = (k, f) => f || k, lang = 'en', className = '' }) {
  return (
    <footer className={className} style={{
      marginTop: 'auto',
      borderTop: '1px solid var(--surface-border)',
      background: 'var(--surface-color)',
      padding: '2.5rem 0 1.5rem 0',
      color: 'var(--text-secondary)',
      fontSize: '0.85rem'
    }}>
      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          justifyContent: 'space-between'
        }} className="footer-top">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <CloudSun size={20} style={{ color: 'var(--accent-blue)' }} />
              <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>WeatherGPT</span>
            </div>
            <p style={{ maxWidth: '460px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              {t('footerDesc', 'AI-Powered Conversational Weather Assistant providing weather intelligence, visual atmospheric dashboards, and smart forecasting.')}
            </p>
          </div>

          <div className="glass-card" style={{
            padding: '1rem',
            borderColor: 'rgba(234, 179, 8, 0.25)',
            background: 'rgba(234, 179, 8, 0.05)',
            maxWidth: '540px'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <AlertTriangle size={18} style={{ color: '#facc15', flexShrink: 0, marginTop: '2px' }} />
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                <strong style={{ color: 'var(--text-primary)' }}>{t('importantDisclaimer', 'Important Disclaimer')}:</strong>{' '}
                {t('footerDisclaimerText', 'WeatherGPT is an AI weather dashboard demonstration project. It is not an official disaster-warning or civil protection authority. Always consult official national meteorological services for official weather advisories and emergency directives.')}
              </div>
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid var(--surface-border)',
          paddingTop: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem',
          color: 'var(--text-muted)',
          fontSize: '0.78rem'
        }}>
          <div>
            © {new Date().getFullYear()} WeatherGPT • {t('openMeteoAttribution', 'Open-Meteo & ECMWF ERA5 Telemetry')}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span>{t('liveTelemetry', 'Live Atmospheric Telemetry')}</span>
            <span>•</span>
            <span>React + Vite</span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--accent-blue)' }}>
              <ShieldCheck size={14} /> {t('trustArchitecture', 'Trust Architecture')}
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .footer-top {
            flex-direction: row !important;
            align-items: flex-start !important;
          }
        }
      `}</style>
    </footer>
  );
}
