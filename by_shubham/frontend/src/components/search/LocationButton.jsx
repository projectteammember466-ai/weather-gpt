import React from 'react';
import { Navigation, Loader2 } from 'lucide-react';

export function LocationButton({ onRequestLocation, geoState, t = (k, f) => f || k }) {
  const isRequesting = geoState?.status === 'requesting';

  return (
    <button
      onClick={onRequestLocation}
      disabled={isRequesting}
      className="btn-secondary"
      title={t('useMyLocation', 'Use My Location')}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: '0.625rem 1rem',
        whiteSpace: 'nowrap',
        cursor: isRequesting ? 'not-allowed' : 'pointer'
      }}
    >
      {isRequesting ? (
        <Loader2 size={16} className="animate-spin" style={{ color: 'var(--accent-blue)' }} />
      ) : (
        <Navigation size={16} style={{ color: 'var(--accent-blue)' }} />
      )}
      <span>{isRequesting ? t('locating', 'Locating...') : t('useMyLocation', 'Use My Location')}</span>
    </button>
  );
}
