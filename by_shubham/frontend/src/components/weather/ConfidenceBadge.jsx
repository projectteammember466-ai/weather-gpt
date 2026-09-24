import React from 'react';
import { ShieldCheck, AlertTriangle, HelpCircle } from 'lucide-react';

export function ConfidenceBadge({ confidence, t = (k, f) => f || k }) {
  if (!confidence) return null;

  const level = confidence.level || 'High';
  const percentage = confidence.percentage || 85;
  const windowText = confidence.forecastWindow || '';

  const getStyle = () => {
    switch (level.toLowerCase()) {
      case 'high':
        return {
          bg: 'rgba(16, 185, 129, 0.15)',
          color: '#10b981',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          icon: ShieldCheck
        };
      case 'medium':
        return {
          bg: 'rgba(234, 179, 8, 0.15)',
          color: '#eab308',
          border: '1px solid rgba(234, 179, 8, 0.3)',
          icon: AlertTriangle
        };
      case 'low':
      default:
        return {
          bg: 'rgba(239, 68, 68, 0.15)',
          color: '#ef4444',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          icon: HelpCircle
        };
    }
  };

  const style = getStyle();
  const Icon = style.icon;

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.4rem',
      padding: '0.25rem 0.65rem',
      borderRadius: 'var(--radius-full)',
      background: style.bg,
      color: style.color,
      border: style.border,
      fontSize: '0.75rem',
      fontWeight: 700
    }}
    title={confidence.uncertaintyExplanation || 'Model projection confidence'}
    >
      <Icon size={13} />
      <span>{t(level.toLowerCase(), level)} {t('confidence', 'Confidence')} ({percentage}%)</span>
      {windowText && <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>• {windowText}</span>}
    </div>
  );
}
