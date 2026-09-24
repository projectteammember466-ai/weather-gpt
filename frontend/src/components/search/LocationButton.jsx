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
      aria-label={t('useMyLocation', 'Use My Location')}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.4rem',
        padding: '0.625rem 0.85rem',
        minHeight: '42px',
        minWidth: '42px',
        whiteSpace: 'nowrap',
        cursor: isRequesting ? 'not-allowed' : 'pointer'
      }}
    >
      {isRequesting ? (
        <Loader2 size={16} className="animate-spin" style={{ color: 'var(--accent-blue)' }} />
      ) : (
        <Navigation size={16} style={{ color: 'var(--accent-blue)' }} />
      )}
      <span className="location-btn-text">{isRequesting ? t('locating', 'Locating...') : t('useMyLocation', 'Use My Location')}</span>
    </button>
  );
}
