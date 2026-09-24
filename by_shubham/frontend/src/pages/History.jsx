import React from 'react';
import { History as HistoryIcon, Trash2, MapPin, Search, ArrowUpRight } from 'lucide-react';
import { EmptyState } from '../components/states/EmptyState';

export function History({ searchHistory = [], onSelectCity, onClearHistory, lang = 'en', t = (k, f) => f || k }) {
  return (
    <div className="page-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <HistoryIcon size={24} style={{ color: 'var(--accent-blue)' }} />
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>
            {t('searchHistoryTitle', 'Search & Query History')}
          </h1>
        </div>

        {searchHistory.length > 0 && (
          <button
            onClick={onClearHistory}
            className="btn-secondary"
            style={{ color: '#ef4444', gap: '0.4rem', fontSize: '0.82rem' }}
          >
            <Trash2 size={14} /> {t('clearHistory', 'Clear History')}
          </button>
        )}
      </div>

      {searchHistory.length === 0 ? (
        <EmptyState
          title={t('noHistory', 'No Recent Searches')}
          description={t('noHistoryDesc', 'Your search and location query history will be displayed here for quick access.')}
          icon={HistoryIcon}
          t={t}
        />
      ) : (
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {searchHistory.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--surface-color)',
                  border: '1px solid var(--surface-border)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    padding: '0.5rem',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--accent-glow)',
                    color: 'var(--accent-blue)'
                  }}>
                    <MapPin size={16} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.98rem', fontWeight: 700 }}>{item.city}</h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {item.country} • {t('searchedAt', 'Searched')}: {new Date(item.timestamp).toLocaleString(lang === 'hi' ? 'hi-IN' : 'en-US')}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onSelectCity(item.city)}
                  className="btn-secondary"
                  style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', gap: '0.25rem' }}
                >
                  <span>{t('searchAgain', 'Search Again')}</span>
                  <ArrowUpRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
