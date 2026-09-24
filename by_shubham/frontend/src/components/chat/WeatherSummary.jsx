import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { localizeCondition } from '../../data/translations';

export function WeatherSummary({ weather, onOpenChat, lang = 'en', t = (k, f) => f || k }) {
  if (!weather) return null;

  const { location, current } = weather;
  const temp = current.temperature;
  const condition = current.condition;
  const localizedCondition = localizeCondition(condition, lang);

  const getSummarySentence = () => {
    if (lang === 'hi') {
      return (
        <>
          आज <strong>{location.city}</strong> में मौसम <strong>{localizedCondition}</strong> बना रहेगा और औसत तापमान <strong>{temp}°C</strong> रहेगा।
        </>
      );
    }
    if (lang === 'hinglish') {
      return (
        <>
          Aaj <strong>{location.city}</strong> mein mausam <strong>{localizedCondition}</strong> rahega with average temperature <strong>{temp}°C</strong>.
        </>
      );
    }
    return (
      <>
        Today in <strong>{location.city}</strong> will remain <strong>{localizedCondition}</strong> with temperatures averaging <strong>{temp}°C</strong>.
      </>
    );
  };

  return (
    <div className="glass-card" style={{
      padding: '1.25rem',
      borderColor: 'rgba(99, 102, 241, 0.3)',
      background: 'radial-gradient(circle at 100% 0%, rgba(99, 102, 241, 0.1) 0%, var(--surface-color) 70%)',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      height: '100%',
      justifyContent: 'space-between'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-indigo)' }}>
          <Sparkles size={16} />
          <span>{t('weatherSummaryTitle', 'WeatherGPT AI Summary')}</span>
        </div>
        <span className="badge badge-info" style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem' }}>
          {t('aiGeneratedSummary', 'AI-generated summary')}
        </span>
      </div>

      <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
        {getSummarySentence()}
      </p>

      <div style={{
        background: 'var(--accent-glow)',
        padding: '0.65rem 0.85rem',
        borderRadius: 'var(--radius-md)',
        fontSize: '0.82rem',
        color: 'var(--accent-blue)',
        fontWeight: 600
      }}>
        💡 <strong>{t('tip', 'Tip')}:</strong> {t('summaryTip', 'Stay hydrated during peak afternoon hours if spending time outdoors.')}
      </div>

      {onOpenChat && (
        <button
          onClick={onOpenChat}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '0.35rem',
            fontSize: '0.82rem',
            fontWeight: 700,
            color: 'var(--accent-blue)',
            marginTop: '0.25rem',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <span>{t('askWeatherGPTDetails', 'Ask WeatherGPT details')}</span>
          <ArrowRight size={14} />
        </button>
      )}
    </div>
  );
}
