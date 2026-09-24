import React from 'react';
import { Sparkles, MapPin, Clock, Compass, Tag, CheckCircle } from 'lucide-react';

export function ChatIntentCard({ understanding, t = (k, f) => f || k }) {
  if (!understanding) return null;

  const { location, time, intentLabel, topic, status } = understanding;

  return (
    <div style={{
      background: 'rgba(56, 189, 248, 0.08)',
      border: '1px solid rgba(56, 189, 248, 0.25)',
      borderRadius: 'var(--radius-md)',
      padding: '0.65rem 0.85rem',
      margin: '0.4rem 0 0.65rem 0',
      fontSize: '0.78rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 800, color: 'var(--accent-blue)', textTransform: 'uppercase', fontSize: '0.7rem' }}>
          <Sparkles size={12} />
          <span>{t('intentUnderstanding', 'Intent Understanding Analysis')}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#10b981', fontWeight: 600, fontSize: '0.7rem' }}>
          <CheckCircle size={11} />
          <span>{status}</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', color: 'var(--text-secondary)' }}>
        {location && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <MapPin size={12} style={{ color: 'var(--accent-blue)' }} />
            <span>{t('location', 'Location')}: <strong style={{ color: 'var(--text-primary)' }}>{location}</strong></span>
          </div>
        )}

        {time && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Clock size={12} style={{ color: 'var(--accent-cyan)' }} />
            <span>{t('time', 'Time')}: <strong style={{ color: 'var(--text-primary)' }}>{time}</strong></span>
          </div>
        )}

        {intentLabel && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Compass size={12} style={{ color: 'var(--accent-indigo)' }} />
            <span>{t('intent', 'Intent')}: <strong style={{ color: 'var(--text-primary)' }}>{intentLabel}</strong></span>
          </div>
        )}

        {topic && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Tag size={12} style={{ color: '#f59e0b' }} />
            <span>{t('topic', 'Topic')}: <strong style={{ color: 'var(--text-primary)' }}>{topic}</strong></span>
          </div>
        )}
      </div>
    </div>
  );
}
