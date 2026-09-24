import React from 'react';
import { 
  User, Sprout, Plane, Sun, AlertTriangle, Car, CalendarCheck, Activity 
} from 'lucide-react';
import { CONTEXT_MODES, getContextMode, getContextAdvisory } from '../../data/contextModes';

const MODE_ICONS = {
  general: User,
  farmer: Sprout,
  traveler: Plane,
  outdoor: Sun,
  emergency: AlertTriangle,
  commuter: Car,
  event_planner: CalendarCheck,
  fitness: Activity
};

export function UserContextModeSelector({ 
  userMode = 'general', 
  onSelectMode, 
  advice, 
  lang = 'en', 
  t = (k, f) => f || k 
}) {
  const currentMode = getContextMode(userMode);
  const currentAdvisory = getContextAdvisory(userMode, lang) || (advice && advice[userMode]);
  const currentLabel = currentMode.names[lang] || currentMode.names.en;

  return (
    <div style={{ margin: '1rem 0' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.5rem',
        marginBottom: '0.65rem'
      }}>
        <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
          {t('contextModeTitle', 'Context Mode')}:
        </span>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {CONTEXT_MODES.map((m) => {
            const Icon = MODE_ICONS[m.id] || User;
            const isSelected = userMode === m.id;
            const label = m.names[lang] || m.names.en;

            return (
              <button
                key={m.id}
                onClick={() => onSelectMode(m.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.78rem',
                  fontWeight: isSelected ? 800 : 500,
                  background: isSelected ? 'var(--accent-glow)' : 'var(--surface-card)',
                  color: isSelected ? 'var(--accent-blue)' : 'var(--text-secondary)',
                  border: isSelected ? '1.5px solid var(--accent-blue)' : '1px solid var(--surface-border)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <Icon size={13} />
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mode Advisory Card */}
      {currentAdvisory && (
        <div className="page-fade-in" style={{
          background: userMode === 'emergency' ? 'rgba(239, 68, 68, 0.1)' : 'var(--surface-color)',
          borderLeft: `4px solid ${userMode === 'emergency' ? '#ef4444' : 'var(--accent-blue)'}`,
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.85rem',
          color: 'var(--text-primary)',
          lineHeight: 1.4,
          marginTop: '0.5rem'
        }}>
          <strong>{currentLabel} {t('advisory', 'Advisory')}: </strong>
          {currentAdvisory}
        </div>
      )}
    </div>
  );
}
