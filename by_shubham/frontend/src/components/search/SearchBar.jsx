import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { SearchSuggestions } from './SearchSuggestions';
import { LocationButton } from './LocationButton';

export function SearchBar({ onSearchCity, onAskAI, onRequestLocation, geoState, searchHistory, isSearching, t = (k, f) => f || k }) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanQuery = query.trim();
    if (!cleanQuery) return;

    const lower = cleanQuery.toLowerCase();
    if (lower.includes('rain') || lower.includes('temperature') || lower.includes('weather in') || lower.includes('will it') || lower.includes('how is') || lower.includes('baarish') || lower.includes('taapmaan') || lower.includes('kya')) {
      if (onAskAI) onAskAI(cleanQuery);
    } else {
      if (onSearchCity) onSearchCity(cleanQuery);
    }

    setIsOpen(false);
  };

  const handleSelectCity = (city) => {
    setQuery(city);
    onSearchCity(city);
    setIsOpen(false);
  };

  const handleSelectQuery = (q) => {
    setQuery(q);
    if (onAskAI) onAskAI(q);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', maxWidth: '720px', margin: '0 auto' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem', width: '100%', alignItems: 'center' }}>
        <div style={{
          position: 'relative',
          flex: 1,
          display: 'flex',
          alignItems: 'center'
        }}>
          {isSearching ? (
            <Loader2 size={18} className="animate-spin" style={{ position: 'absolute', left: '1rem', color: 'var(--accent-blue)', animation: 'spin 1s linear infinite' }} />
          ) : (
            <Search 
              size={18} 
              style={{ position: 'absolute', left: '1rem', color: 'var(--text-muted)' }} 
            />
          )}
          <input
            type="text"
            role="combobox"
            aria-expanded={isOpen}
            aria-autocomplete="list"
            aria-label={t('searchPlaceholder', 'Search city or ask about weather...')}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder={t('searchPlaceholder', 'Search city or ask about weather...')}
            style={{
              width: '100%',
              padding: '0.75rem 2.5rem 0.75rem 2.75rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--surface-card)',
              border: '1px solid var(--surface-border)',
              fontSize: '0.95rem',
              color: 'var(--text-primary)',
              boxShadow: 'var(--shadow-sm)'
            }}
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setIsOpen(false);
              }}
              aria-label={t('clearSearch', 'Clear search input')}
              style={{
                position: 'absolute',
                right: '0.85rem',
                color: 'var(--text-muted)',
                padding: '0.2rem',
                display: 'flex',
                alignItems: 'center',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        <button 
          type="submit" 
          className="btn-primary"
          style={{ whiteSpace: 'nowrap' }}
          disabled={!query.trim()}
        >
          <span>{t('search', 'Search')}</span>
        </button>

        <LocationButton onRequestLocation={onRequestLocation} geoState={geoState} t={t} />
      </form>

      {isOpen && (
        <SearchSuggestions
          query={query}
          onSelectCity={handleSelectCity}
          onSelectQuery={handleSelectQuery}
          searchHistory={searchHistory}
          onClose={() => setIsOpen(false)}
          t={t}
        />
      )}
    </div>
  );
}
