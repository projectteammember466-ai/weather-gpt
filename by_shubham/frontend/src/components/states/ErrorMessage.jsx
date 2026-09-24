import React from 'react';
import { AlertCircle } from 'lucide-react';
import { RetryButton } from './RetryButton';

export function ErrorMessage({ message, onRetry, t = (k, f) => f || k }) {
  return (
    <div className="glass-card" style={{
      padding: '2rem',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1rem',
      maxWidth: '480px',
      margin: '2rem auto',
      borderColor: 'rgba(239, 68, 68, 0.3)'
    }}>
      <AlertCircle size={40} style={{ color: '#ef4444' }} />
      <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>
        {t('errorTitle', 'Weather Update Unavailable')}
      </h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
        {message || t('errorDefault', "Weather data couldn't be loaded. Please check your query or try again.")}
      </p>
      {onRetry && <RetryButton onRetry={onRetry} t={t} />}
    </div>
  );
}
