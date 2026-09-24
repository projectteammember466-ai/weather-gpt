import React from 'react';
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export function FreshnessBadge({ metadata, t = (k, f) => f || k }) {
  if (!metadata) return null;

  const freshness = metadata.freshness || 'Fresh';
  const updatedAt = metadata.updatedAt || 'Just now';

  const getStyle = () => {
    switch (freshness.toLowerCase()) {
      case 'fresh':
        return {
          bg: 'rgba(56, 189, 248, 0.12)',
          color: 'var(--accent-blue)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          icon: CheckCircle2,
          dotColor: '#10b981'
        };
      case 'aging':
        return {
          bg: 'rgba(234, 179, 8, 0.12)',
          color: '#eab308',
          border: '1px solid rgba(234, 179, 8, 0.3)',
          icon: Clock,
          dotColor: '#eab308'
        };
      case 'stale':
      default:
        return {
          bg: 'rgba(239, 68, 68, 0.12)',
          color: '#ef4444',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          icon: AlertCircle,
          dotColor: '#ef4444'
        };
    }
  };

  const style = getStyle();

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.4rem',
      padding: '0.2rem 0.6rem',
      borderRadius: 'var(--radius-full)',
      background: style.bg,
      color: style.color,
      border: style.border,
      fontSize: '0.72rem',
      fontWeight: 600
    }}>
      <span style={{
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        backgroundColor: style.dotColor,
        display: 'inline-block'
      }} />
      <span>
        {updatedAt === 'Just now' ? t('justNow', 'Just now') : updatedAt} • {t(freshness.toLowerCase(), freshness)}
      </span>
    </div>
  );
}
