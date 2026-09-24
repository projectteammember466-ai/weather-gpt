import React from 'react';
import { Loader2 } from 'lucide-react';

export function Loading({ message, t = (k, f) => f || k }) {
  const displayMsg = message || t('loading', 'Loading weather data...');
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 1.5rem',
      gap: '1rem',
      color: 'var(--text-secondary)'
    }}>
      <Loader2 size={32} className="animate-spin" style={{ color: 'var(--accent-blue)', animation: 'spin 1s linear infinite' }} />
      <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{displayMsg}</p>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
