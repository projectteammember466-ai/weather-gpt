import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Sparkles, Clock, Loader2, AlertCircle } from 'lucide-react';
import { searchGeocoding } from '../../services/api';
import { createCanonicalLocation } from '../../utils/locationModel';

export function SearchSuggestions({ 
  query, 
  onSelectLocation, 
  onSelectQuery, 
  searchHistory = [], 
  onClose, 
  t = (k, f) => f || k 
}) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchSequenceRef = useRef(0);

  const popularCities = [
    { name: 'Jodhpur', state: 'Rajasthan', country: 'India', latitude: 26.2389, longitude: 73.0243 },
    { name: 'Delhi', state: 'Delhi', country: 'India', latitude: 28.6139, longitude: 77.2090 },
    { name: 'Mumbai', state: 'Maharashtra', country: 'India', latitude: 19.0760, longitude: 72.8777 },
    { name: 'Jaipur', state: 'Rajasthan', country: 'India', latitude: 26.9124, longitude: 75.7873 },
    { name: 'London', state: 'England', country: 'United Kingdom', latitude: 51.5074, longitude: -0.1278 },
    { name: 'Tokyo', state: 'Kanto', country: 'Japan', latitude: 35.6762, longitude: 139.6503 }
  ];

  const sampleQueries = [
    "Weather in Jaipur tomorrow",
    "Will it rain today?",
    "Temperature in Jodhpur",
    "How is the weather this evening?"
  ];

  // Debounced live geocoding search as user types
  useEffect(() => {
    const cleanQuery = (query || '').trim();
    if (!cleanQuery || cleanQuery.length < 2) {
      setSuggestions([]);
      setLoading(false);
      setSelectedIndex(-1);
      return;
    }

    const sequenceToken = ++searchSequenceRef.current;
    setLoading(true);

    const timer = setTimeout(async () => {
      try {
        const results = await searchGeocoding(cleanQuery);
        if (sequenceToken === searchSequenceRef.current) {
          if (Array.isArray(results) && results.length > 0) {
            const canonicalList = results.map(item => createCanonicalLocation({
              name: item.city || item.name,
              state: item.region || item.admin1 || '',
              country: item.country || '',
              countryCode: item.countryCode || '',
              latitude: item.latitude || item.lat,
              longitude: item.longitude || item.lon,
              timezone: item.timezone || 'UTC'
            }));
            setSuggestions(canonicalList);
          } else {
            setSuggestions([]);
          }
        }
      } catch (err) {
        if (sequenceToken === searchSequenceRef.current) {
          setSuggestions([]);
        }
      } finally {
        if (sequenceToken === searchSequenceRef.current) {
          setLoading(false);
        }
      }
    }, 250); // 250ms debounce

    return () => clearTimeout(timer);
  }, [query]);

  // Keyboard Navigation Handling (Arrow Up / Down / Enter)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!query || suggestions.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : suggestions.length - 1));
      } else if (e.key === 'Enter' && selectedIndex >= 0 && selectedIndex < suggestions.length) {
        e.preventDefault();
        onSelectLocation(suggestions[selectedIndex]);
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [query, suggestions, selectedIndex, onSelectLocation, onClose]);

  const cleanQuery = (query || '').trim();

  return (
    <div 
      className="glass-card" 
      role="listbox"
      id="search-suggestions-listbox"
      aria-label="Location suggestions"
      style={{
        position: 'absolute',
        top: 'calc(100% + 8px)',
        left: 0,
        right: 0,
        zIndex: 100,
        padding: '1rem',
        maxHeight: 'min(380px, 60vh)',
        overflowY: 'auto',
        background: 'var(--surface-card)',
        boxShadow: 'var(--shadow-lg)',
        borderRadius: 'var(--radius-md)'
      }}
    >
      {/* Loading state indicator */}
      {loading && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', color: 'var(--accent-blue)', fontSize: '0.85rem' }}>
          <Loader2 size={16} className="animate-spin" />
          <span>{t('searchingLocations', 'Searching location database...')}</span>
        </div>
      )}

      {/* No results state */}
      {!loading && cleanQuery.length >= 2 && suggestions.length === 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          <AlertCircle size={16} />
          <span>{t('noLocationsFound', 'No location results found for')} "{cleanQuery}".</span>
        </div>
      )}

      {/* Live Geocoded Autosuggestion Results */}
      {!loading && suggestions.length > 0 && (
        <div style={{ marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.72rem', fontWeight: 750, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            <MapPin size={12} /> {t('matchingLocations', 'Matching Locations')} ({suggestions.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {suggestions.map((loc, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={loc.id || idx}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onSelectLocation(loc);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  style={{
                    textAlign: 'left',
                    padding: '0.5rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    background: isSelected ? 'var(--accent-glow)' : 'var(--surface-color)',
                    border: isSelected ? '1px solid var(--accent-blue)' : '1px solid var(--surface-border)',
                    fontSize: '0.85rem',
                    color: 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MapPin size={14} style={{ color: isSelected ? 'var(--accent-blue)' : 'var(--text-muted)' }} />
                    <div>
                      <strong style={{ display: 'block', fontSize: '0.88rem' }}>{loc.name}</strong>
                      {(loc.state || loc.country) && (
                        <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                          {[loc.state, loc.country].filter(Boolean).join(', ')}
                        </span>
                      )}
                    </div>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--accent-blue)', opacity: isSelected ? 1 : 0 }}>
                    Select ↵
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Search History section if query is empty */}
      {!cleanQuery && searchHistory.length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            <Clock size={12} /> {t('recentSearches', 'Recent Searches')}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {searchHistory.slice(0, 5).map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  const locObj = createCanonicalLocation({
                    name: item.city || item.query,
                    displayName: item.displayName || item.city || item.query,
                    latitude: item.latitude,
                    longitude: item.longitude,
                    country: item.country
                  });
                  onSelectLocation(locObj);
                  onClose();
                }}
                style={{
                  padding: '0.35rem 0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--surface-color)',
                  border: '1px solid var(--surface-border)',
                  fontSize: '0.8rem',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                <Clock size={12} style={{ color: 'var(--text-muted)' }} />
                <span>{item.displayName || item.city || item.query}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Popular Cities if query is empty */}
      {!cleanQuery && (
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            <MapPin size={12} /> {t('popularCities', 'Popular Cities')}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {popularCities.map((city) => (
              <button
                key={city.name}
                onClick={() => {
                  const locObj = createCanonicalLocation(city);
                  onSelectLocation(locObj);
                  onClose();
                }}
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
                {city.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* AI Sample Questions */}
      {!cleanQuery && (
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
      )}
    </div>
  );
}

export default SearchSuggestions;
