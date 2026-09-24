import React from 'react';
import { AlertCard } from './AlertCard';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';

export function AlertDetails({ alerts = [], city = "", t = (k, f) => f || k }) {
  if (!alerts || alerts.length === 0) {
    return (
      <div className="glass-card" style={{
        padding: '1.75rem 1.25rem',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.65rem',
        height: '100%',
        justifyContent: 'center'
      }}>
        <CheckCircle2 size={32} style={{ color: '#10b981' }} />
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>
          {t('noActiveAlerts', 'No Active Weather Alerts')}
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', maxWidth: '380px', margin: 0 }}>
          {t('noAlertsDesc', 'There are currently no official weather warnings or alerts for')} {city || t('thisLocation', 'this location')}.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <ShieldAlert size={20} style={{ color: '#ef4444' }} />
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
          {t('activeAlerts', 'Active Weather Alerts')} ({alerts.length})
        </h2>
      </div>
      {alerts.map((alert) => (
        <AlertCard key={alert.id} alert={alert} t={t} />
      ))}
    </div>
  );
}
