import React, { useState } from 'react';
import { Calendar, Droplets, Thermometer, TrendingUp, Info, History, ArrowRight } from 'lucide-react';
import { formatTemperature } from '../../utils/formatTemperature';

export function ClimateSummary({ climate, tempUnit = 'C', onNavigateHistorical, lang = 'en', t = (k, f) => f || k }) {
  const [viewMode, setViewMode] = useState('chart'); // 'chart' | 'table'

  if (!climate) return null;

  const maxTemp = Math.max(...climate.months.map(m => m.avgHigh));
  const maxRain = Math.max(...climate.months.map(m => m.rainfall));

  return (
    <div className="glass-card" style={{ padding: '1.5rem', marginTop: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calendar size={20} style={{ color: 'var(--accent-blue)' }} />
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800 }}>
              {t('climateNormalsTitle', 'Climate Normals & Historical Trends')}
            </h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {climate.city} • {climate.climateType}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setViewMode(viewMode === 'chart' ? 'table' : 'chart')}
            className="btn-secondary"
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem', cursor: 'pointer' }}
          >
            {viewMode === 'chart' ? t('viewTable', 'View Table') : t('viewGraph', 'View Graph')}
          </button>

          {onNavigateHistorical && (
            <button
              onClick={onNavigateHistorical}
              className="btn-primary"
              style={{ padding: '0.35rem 0.85rem', fontSize: '0.78rem', gap: '0.35rem', cursor: 'pointer' }}
            >
              <History size={14} />
              <span>{t('fullHistoricalWeather', 'Full Historical Weather')}</span>
              <ArrowRight size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Climate Highlights Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '0.75rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{ background: 'var(--surface-color)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.2rem' }}>
            <Thermometer size={14} style={{ color: 'var(--accent-blue)' }} />
            <span>{t('annualAvgTemp', 'Annual Avg Temperature')}</span>
          </div>
          <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>{climate.annualAvgTemp}</span>
        </div>

        <div style={{ background: 'var(--surface-color)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.2rem' }}>
            <Droplets size={14} style={{ color: 'var(--accent-cyan)' }} />
            <span>{t('annualNormalRainfall', 'Annual Normal Rainfall')}</span>
          </div>
          <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>{climate.annualRainfall}</span>
        </div>

        <div style={{ background: 'var(--surface-color)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.2rem' }}>
            <TrendingUp size={14} style={{ color: '#10b981' }} />
            <span>{t('historicalClimateTrend', '20-Year Climate Trend')}</span>
          </div>
          <span style={{ fontSize: '1rem', fontWeight: 700, color: '#10b981' }}>{climate.historicalTrend}</span>
        </div>
      </div>

      {/* Monthly Bar Graphic or Table */}
      {viewMode === 'chart' ? (
        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', paddingBottom: '0.5rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', minWidth: '550px', alignItems: 'flex-end', height: '180px', paddingTop: '1.5rem' }}>
            {climate.months.map((m, idx) => {
              const tempHeight = Math.max(15, (m.avgHigh / maxTemp) * 110);
              const rainHeight = Math.max(4, (m.rainfall / maxRain) * 110);
              const localizedMonth = t(m.month.toLowerCase(), m.month);

              return (
                <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem', height: '100%', justifyContent: 'flex-end' }}>
                  {/* Temp Value */}
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {formatTemperature(m.avgHigh, tempUnit)}
                  </span>
                  
                  {/* Bars side by side */}
                  <div style={{ display: 'flex', gap: '3px', alignItems: 'flex-end', width: '100%', justifyContent: 'center' }}>
                    {/* Temp bar */}
                    <div 
                      title={`${t('avgHigh', 'Avg High')}: ${formatTemperature(m.avgHigh, tempUnit)}`}
                      style={{
                        width: '40%',
                        maxWidth: '12px',
                        height: `${tempHeight}px`,
                        background: 'linear-gradient(to top, #f97316, #fb923c)',
                        borderRadius: '3px 3px 0 0'
                      }}
                    />
                    {/* Rain bar */}
                    <div 
                      title={`${t('rainfall', 'Rainfall')}: ${m.rainfall} mm`}
                      style={{
                        width: '40%',
                        maxWidth: '12px',
                        height: `${rainHeight}px`,
                        background: 'linear-gradient(to top, #0284c7, #38bdf8)',
                        borderRadius: '3px 3px 0 0'
                      }}
                    />
                  </div>

                  {/* Month name */}
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '0.2rem' }}>
                    {localizedMonth}
                  </span>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', marginTop: '1rem', fontSize: '0.78rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: '10px', height: '10px', background: '#fb923c', borderRadius: '2px', display: 'inline-block' }} />
              <span>{t('averageHighTemp', 'Average High Temp')}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: '10px', height: '10px', background: '#38bdf8', borderRadius: '2px', display: 'inline-block' }} />
              <span>{t('normalPrecipitation', 'Normal Precipitation (mm)')}</span>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--surface-border)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.5rem', textAlign: 'left' }}>{t('month', 'Month')}</th>
                <th style={{ padding: '0.5rem', textAlign: 'right' }}>{t('normalHigh', 'Normal High')}</th>
                <th style={{ padding: '0.5rem', textAlign: 'right' }}>{t('normalLow', 'Normal Low')}</th>
                <th style={{ padding: '0.5rem', textAlign: 'right' }}>{t('rainfall', 'Rainfall')} (mm)</th>
              </tr>
            </thead>
            <tbody>
              {climate.months.map((m, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--surface-border)' }}>
                  <td style={{ padding: '0.5rem', fontWeight: 600 }}>{t(m.month.toLowerCase(), m.month)}</td>
                  <td style={{ padding: '0.5rem', textAlign: 'right', color: '#f97316' }}>{formatTemperature(m.avgHigh, tempUnit)}</td>
                  <td style={{ padding: '0.5rem', textAlign: 'right', color: 'var(--accent-blue)' }}>{formatTemperature(m.avgLow, tempUnit)}</td>
                  <td style={{ padding: '0.5rem', textAlign: 'right' }}>{m.rainfall} mm</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
        <Info size={13} />
        <span>{t('climateDatasetNote', 'Based on 30-year climatological normals demo baseline.')}</span>
      </div>
    </div>
  );
}
