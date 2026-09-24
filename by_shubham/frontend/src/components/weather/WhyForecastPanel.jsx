import React from 'react';
import { X, Sparkles, Activity, Compass, Info, ArrowRight } from 'lucide-react';

export function WhyForecastPanel({ whyForecast, city, onClose, t = (k, f) => f || k }) {
  if (!whyForecast) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 100,
      background: 'rgba(0, 0, 0, 0.65)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div className="glass-card page-fade-in" style={{
        maxWidth: '650px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '1.75rem',
        background: 'var(--surface-card)',
        borderColor: 'rgba(56, 189, 248, 0.3)',
        boxShadow: 'var(--shadow-lg)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--surface-border)', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              padding: '0.4rem',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--accent-glow)',
              color: 'var(--accent-blue)'
            }}>
              <Sparkles size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                {t('whyForecast', 'Why this forecast?')}
              </h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {t('atmosphericDiagnosticsFor', 'Atmospheric Diagnostic Breakdown for')} {city}
              </span>
            </div>
          </div>

          <button 
            onClick={onClose}
            aria-label={t('close', 'Close')}
            style={{ padding: '0.35rem', color: 'var(--text-muted)', borderRadius: 'var(--radius-sm)', background: 'transparent', border: 'none', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Step 1: Observed Signals */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-blue)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            <Activity size={14} /> 1. {t('observedSignals', 'Observed Atmospheric Signals')}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.65rem' }}>
            {whyForecast.signals?.map((sig, idx) => (
              <div key={idx} style={{
                background: 'var(--surface-color)',
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--surface-border)'
              }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>{sig.name}</span>
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>{sig.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Step 2: Meteorological Reasoning */}
        <div style={{
          background: 'var(--surface-color)',
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          borderLeft: '4px solid var(--accent-indigo)',
          marginBottom: '1.25rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-indigo)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
            <Compass size={14} /> 2. {t('meteorologicalReasoning', 'Meteorological Reasoning')}
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
            {whyForecast.reasoning}
          </p>
        </div>

        {/* Step 3: AI Plain-Language Explanation */}
        <div style={{
          background: 'var(--accent-glow)',
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          marginBottom: '1.25rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-blue)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
            <Sparkles size={14} /> 3. {t('weatherGPTTakeaway', 'WeatherGPT Takeaway')}
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.5, fontWeight: 500 }}>
            {whyForecast.aiExplanation}
          </p>
        </div>

        {/* Transparency note */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          <Info size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
          <span>
            {t('diagnosticDisclaimer', 'WeatherGPT diagnostic reasoning is synthesized from numerical weather prediction parameters for educational demonstration.')}
          </span>
        </div>
      </div>
    </div>
  );
}
