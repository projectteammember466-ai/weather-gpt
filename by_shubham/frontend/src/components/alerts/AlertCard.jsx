import React, { useState } from 'react';
import { AlertBadge } from './AlertBadge';
import { MapPin, Calendar, ChevronDown, ChevronUp, ShieldCheck, Sparkles } from 'lucide-react';

export function AlertCard({ alert, t = (k, d) => d || k }) {
  const [showDetails, setShowDetails] = useState(false);

  if (!alert) return null;

  const isHighSeverity = alert.severity === 'EXTREME' || alert.severity === 'SEVERE';
  const borderColor = isHighSeverity ? 'rgba(239, 68, 68, 0.4)' : 'rgba(234, 179, 8, 0.35)';
  const bgColor = isHighSeverity ? 'rgba(239, 68, 68, 0.08)' : 'rgba(234, 179, 8, 0.06)';

  return (
    <div
      className="glass-card"
      style={{
        padding: '1.25rem',
        borderColor,
        background: bgColor,
        marginBottom: '1rem',
        borderRadius: 'var(--radius-lg)'
      }}
    >
      {/* Alert Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <AlertBadge severity={alert.severity} t={t} />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            {alert.title}
          </h3>
        </div>

        <button
          onClick={() => setShowDetails(!showDetails)}
          className="btn-secondary"
          style={{
            padding: '0.3rem 0.65rem',
            fontSize: '0.78rem',
            gap: '0.3rem',
            borderRadius: 'var(--radius-full)',
            cursor: 'pointer'
          }}
          aria-expanded={showDetails}
          aria-label={showDetails ? t('hideDetails', 'Hide Details') : t('viewDetails', 'View Details')}
        >
          <span>{showDetails ? t('hideDetails', 'Hide Details') : t('viewDetails', 'View Details')}</span>
          {showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {/* Meta Location & Validity Row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        fontSize: '0.78rem',
        color: 'var(--text-secondary)',
        flexWrap: 'wrap',
        marginBottom: '0.75rem'
      }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
          <MapPin size={13} style={{ color: 'var(--accent-blue)' }} />
          <span>{alert.affectedArea}</span>
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
          <Calendar size={13} />
          <span>{alert.validFrom} {t('to', 'to')} {alert.validUntil}</span>
        </span>
      </div>

      {/* Primary Alert Description */}
      <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.5, marginBottom: '0.75rem' }}>
        {alert.officialWarning?.description || alert.description}
      </p>

      {/* Immediate Safety Advice */}
      {(alert.aiExplanation?.recommendedAction || alert.safetyTip) && (
        <div style={{
          background: 'rgba(56, 189, 248, 0.08)',
          border: '1px solid rgba(56, 189, 248, 0.2)',
          padding: '0.6rem 0.85rem',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.84rem',
          color: 'var(--text-primary)',
          marginBottom: '0.75rem'
        }}>
          <strong style={{ color: 'var(--accent-blue)' }}>💡 {t('safetyAdvice', 'Safety Advice')}:</strong>{' '}
          {alert.aiExplanation?.recommendedAction || alert.safetyTip}
        </div>
      )}

      {/* Official Source Attribution */}
      <div style={{
        fontSize: '0.75rem',
        color: 'var(--text-muted)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.35rem'
      }}>
        <ShieldCheck size={14} style={{ color: isHighSeverity ? '#ef4444' : '#eab308' }} />
        <span>{t('source', 'Source')}: <strong>{alert.officialWarning?.source || 'IMD / Meteorological Authority'}</strong></span>
        {alert.officialWarning?.sourceType && (
          <span>({alert.officialWarning.sourceType})</span>
        )}
      </div>

      {/* Expandable Technical & AI Context Details */}
      {showDetails && (
        <div style={{
          marginTop: '1rem',
          paddingTop: '0.85rem',
          borderTop: '1px solid var(--surface-border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.6rem'
        }}>
          {alert.aiExplanation?.summary && (
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-blue)', marginBottom: '0.25rem' }}>
                <Sparkles size={13} />
                <span>{t('aiAssessment', 'AI Meteorological Assessment')}</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                {alert.aiExplanation.summary}
              </p>
            </div>
          )}

          {alert.aiExplanation?.disclaimer && (
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontStyle: 'italic', margin: 0 }}>
              {alert.aiExplanation.disclaimer}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
