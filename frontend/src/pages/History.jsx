import React, { useState, useEffect, useCallback } from 'react';
import { History as HistoryIcon, Trash2, MapPin, Search, ArrowUpRight, CloudSun, Loader2, RefreshCw } from 'lucide-react';
import { EmptyState } from '../components/states/EmptyState';
import { getOrCreateUserId } from '../utils/userId';
import { fetchSearchHistory, deleteBackendSearchHistory } from '../services/backendApi';

export function History({ 
  searchHistory = [], 
  onSelectCity, 
  onClearHistory, 
  lang = 'en', 
  t = (k, f) => f || k 
}) {
  const userId = getOrCreateUserId();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadHistory = useCallback(async () => {
    try {
      const backendData = await fetchSearchHistory(userId, 25);
      if (Array.isArray(backendData) && backendData.length > 0) {
        setItems(backendData);
      } else if (searchHistory && searchHistory.length > 0) {
        setItems(searchHistory);
      } else {
        setItems([]);
      }
    } catch {
      setItems(searchHistory || []);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [userId, searchHistory]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleDeleteItem = async (e, item) => {
    e.stopPropagation();
    const id = item.searchId || item.id;
    if (id) {
      // Optimistic update
      setItems(prev => prev.filter(i => (i.searchId || i.id) !== id && i.city !== item.city));
      await deleteBackendSearchHistory(id, userId);
    } else {
      setItems(prev => prev.filter(i => i.city !== item.city));
    }
  };

  const handleClearAll = () => {
    setItems([]);
    if (onClearHistory) onClearHistory();
  };

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    loadHistory();
  };

  const formatTimestamp = (ts) => {
    if (!ts) return '';
    try {
      const date = new Date(ts);
      if (isNaN(date.getTime())) return '';
      return date.toLocaleString(lang === 'hi' ? 'hi-IN' : 'en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '';
    }
  };

  return (
    <div className="page-fade-in" style={{ maxWidth: '850px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <HistoryIcon size={24} style={{ color: 'var(--accent-blue)' }} />
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>
            {t('searchHistoryTitle', 'Search & Query History')}
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={handleManualRefresh}
            className="btn-secondary"
            title="Refresh History"
            style={{ padding: '0.4rem 0.6rem', fontSize: '0.82rem', gap: '0.3rem' }}
            disabled={isRefreshing}
          >
            <RefreshCw size={14} className={isRefreshing ? 'spin-icon' : ''} />
            <span>{isRefreshing ? t('refreshing', 'Syncing...') : t('refresh', 'Refresh')}</span>
          </button>

          {items.length > 0 && (
            <button
              onClick={handleClearAll}
              className="btn-secondary"
              style={{ color: '#ef4444', gap: '0.4rem', fontSize: '0.82rem' }}
            >
              <Trash2 size={14} /> {t('clearHistory', 'Clear All')}
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Loader2 size={32} className="spin-icon" style={{ margin: '0 auto 1rem', color: 'var(--accent-blue)' }} />
          <p>{t('loadingHistory', 'Retrieving search history from Firestore...')}</p>
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          title={t('noHistory', 'No Recent Searches')}
          description={t('noHistoryDesc', 'Your search and location query history will be displayed here for quick access.')}
          icon={HistoryIcon}
          t={t}
        />
      ) : (
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {items.map((item, idx) => {
              const displayTitle = item.displayName || item.resolvedName || item.city || item.query || 'Unknown Location';
              const rawQuery = item.rawQuery || item.query;
              const hasDistinctQuery = rawQuery && displayTitle.toLowerCase() !== rawQuery.toLowerCase();
              const snapshot = item.weatherSnapshot;
              const timeString = formatTimestamp(item.searchedAt || item.createdAt || item.timestamp);
              const targetCity = item.resolvedName || item.city || item.displayName || item.query;

              return (
                <div
                  key={item.searchId || item.id || idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.9rem 1.1rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--surface-color)',
                    border: '1px solid var(--surface-border)',
                    transition: 'all 0.2s ease',
                    gap: '1rem',
                    flexWrap: 'wrap'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: 1, minWidth: '220px' }}>
                    <div style={{
                      padding: '0.55rem',
                      borderRadius: 'var(--radius-full)',
                      background: 'var(--accent-glow)',
                      color: 'var(--accent-blue)',
                      flexShrink: 0
                    }}>
                      <MapPin size={18} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>
                          {displayTitle}
                        </h3>
                        {snapshot && (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            padding: '0.15rem 0.5rem',
                            borderRadius: '999px',
                            background: 'rgba(56, 189, 248, 0.12)',
                            color: 'var(--accent-blue)',
                            fontSize: '0.75rem',
                            fontWeight: 600
                          }}>
                            <CloudSun size={12} />
                            {Math.round(snapshot.temperature)}°C • {snapshot.condition || 'Clear'}
                          </span>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.78rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                        {item.country && <span>{item.country}</span>}
                        {hasDistinctQuery && (
                          <span>
                            {t('queriedAs', 'Query')}: <strong style={{ color: 'var(--text-secondary)' }}>"{rawQuery}"</strong>
                          </span>
                        )}
                        {timeString && (
                          <span>• {timeString}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button
                      onClick={() => onSelectCity(targetCity)}
                      className="btn-secondary"
                      style={{ padding: '0.45rem 0.85rem', fontSize: '0.82rem', gap: '0.35rem' }}
                      title={`View weather for ${targetCity}`}
                    >
                      <span>{t('searchAgain', 'Search Again')}</span>
                      <ArrowUpRight size={14} />
                    </button>

                    <button
                      onClick={(e) => handleDeleteItem(e, item)}
                      className="btn-icon"
                      style={{ 
                        padding: '0.45rem', 
                        color: 'var(--text-muted)',
                        borderRadius: 'var(--radius-sm)',
                        transition: 'color 0.15s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                      title={t('delete', 'Delete')}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default History;
