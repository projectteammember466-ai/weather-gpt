import React from 'react';
import { MapPin, Sparkles, Clock } from 'lucide-react';

export function SearchSuggestions({ query, onSelectCity, onSelectQuery, searchHistory = [], onClose, t = (k, f) => f || k }) {
  const popularCities = ["Jodhpur", "Delhi", "Mumbai", "Jaipur", "London", "Tokyo"];
  
  const sampleQueries = [
    "Weather in Jaipur tomorrow",
    "Will it rain today?",
    "Temperature in Jodhpur",
    "How is the weather this evening?"
  ];

  const filteredCities = popularCities.filter(c => 
    c.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="glass-card" style={{
      position: 'absolute',
      top: 'calc(100% + 8px)',
      left: 0,
      right: 0,
      zIndex: 40,
      padding: '1rem',
      background: 'var(--surface-card)',
      boxShadow: 'var(--shadow-lg)',
      borderRadius: 'var(--radius-md)'
    }}>
      {/* Search History section if available and query is empty */}
      {!query && searchHistory.length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            <Clock size={12} /> {t('recentSearches', 'Recent Searches')}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {searchHistory.slice(0, 4).map((item, idx) => (
              <button
                key={idx}
                onClick={() => { onSelectCity(item.city); onClose(); }}
                style={{
                  padding: '0.3rem 0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--surface-color)',
                  border: '1px solid var(--surface-border)',
                  fontSize: '0.8rem',
                  color: 'var(--text-primary)',
                  cursor: 'pointer'
                }}
              >
                {item.city}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Suggested Cities */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          <MapPin size={12} /> {t('popularCities', 'Popular Cities')}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {filteredCities.map((city) => (
            <button
              key={city}
              onClick={() => { onSelectCity(city); onClose(); }}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                background: 'var(--accent-glow)',
                border: '1px solid rgba(56, 189, 248, 0.2)',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: 'var(--accent-blue)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                cursor: 'pointer'
              }}
            >
              <MapPin size={12} />
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* AI Sample Questions */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          <Sparkles size={12} /> {t('askWeatherGPT', 'Ask WeatherGPT')}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {sampleQueries.map((q, idx) => (
            <button
              key={idx}
              onClick={() => { onSelectQuery(q); onClose(); }}
              style={{
                textAlign: 'left',
                padding: '0.45rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--surface-color)',
                border: '1px solid var(--surface-border)',
                fontSize: '0.82rem',
                color: 'var(--text-secondary)',
                cursor: 'pointer'
              }}
            >
              {q}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
