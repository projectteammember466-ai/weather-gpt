import React from 'react';
import { getSeverityBadgeClass } from '../../utils/weatherHelpers';
import { ShieldAlert } from 'lucide-react';

export function AlertBadge({ severity = 'INFO', t = (k, f) => f || k }) {
  const badgeClass = getSeverityBadgeClass(severity);

  return (
    <span className={`badge ${badgeClass}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
      <ShieldAlert size={12} aria-hidden="true" />
      <span>{t(severity.toLowerCase(), severity.toUpperCase())}</span>
    </span>
  );
}
