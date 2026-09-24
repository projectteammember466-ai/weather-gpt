import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar, CalendarRange, Clock, Download, TrendingUp, Droplets, 
  Thermometer, Wind, MapPin, Search, RefreshCw, Table as TableIcon, 
  LineChart, AlertCircle, Info, ChevronRight, ArrowLeft, Cloud, Check
} from 'lucide-react';
import { fetchHistoricalWeather, searchGeocoding } from '../services/api';
import { formatTemperature } from '../utils/formatTemperature';
import { formatWind } from '../utils/formatWind';
import { Loading } from '../components/states/Loading';
import { ErrorMessage } from '../components/states/ErrorMessage';
import { localizeCondition } from '../data/translations';

// Helper to format Date object into YYYY-MM-DD
function toDateString(d) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function HistoricalWeather({
  selectedCity = 'jodhpur',
  onSelectCity,
  weather,
  tempUnit = 'C',
  windUnit = 'kmh',
  onNavigateDashboard,
  lang = 'en',
  t = (k, f) => f || k
}) {
  // Max valid historical date is 2 days ago (ERA5 archive processing buffer)
  const maxAllowedDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 2);
    return toDateString(d);
  }, []);

  // Initial date range: Last 7 Days
  const defaultRange = useMemo(() => {
    const end = new Date();
    end.setDate(end.getDate() - 2);
    const start = new Date(end);
    start.setDate(start.getDate() - 7);
    return {
      start: toDateString(start),
      end: toDateString(end)
    };
  }, []);

  const [startDate, setStartDate] = useState(defaultRange.start);
  const [endDate, setEndDate] = useState(defaultRange.end);
  const [activePreset, setActivePreset] = useState('7d');

  const [historicalData, setHistoricalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search input for custom location inside historical view
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [viewMode, setViewMode] = useState('overview'); // 'overview' | 'table'

  // Determine lat, lon and resolved display name
  const currentCoords = useMemo(() => {
    if (weather?.location?.latitude && weather?.location?.longitude) {
      return {
        lat: Number(weather.location.latitude),
        lon: Number(weather.location.longitude),
        name: weather.location.city || selectedCity,
        country: weather.location.country || ''
      };
    }
    return {
      lat: 26.2389,
      lon: 73.0243,
      name: selectedCity || 'Jodhpur',
      country: 'India'
    };
  }, [weather, selectedCity]);

  // Load historical telemetry from Open-Meteo Archive
  const loadHistorical = async (start, end) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchHistoricalWeather(
        currentCoords.lat,
        currentCoords.lon,
        start,
        end,
        currentCoords.name
      );
      setHistoricalData(data);
    } catch (err) {
      console.error("Failed to load historical weather data:", err);
      setError("Unable to retrieve historical climate records for the specified range. Please try a different date range.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistorical(startDate, endDate);
  }, [currentCoords.lat, currentCoords.lon, startDate, endDate]);

  // Quick Preset Handlers
  const applyPreset = (presetKey) => {
    setActivePreset(presetKey);
    const end = new Date();
    end.setDate(end.getDate() - 2);

    let start = new Date(end);
    if (presetKey === '7d') {
      start.setDate(start.getDate() - 7);
    } else if (presetKey === '14d') {
      start.setDate(start.getDate() - 14);
    } else if (presetKey === '30d') {
      start.setDate(start.getDate() - 30);
    } else if (presetKey === 'last_year') {
      end.setFullYear(end.getFullYear() - 1);
      start = new Date(end);
      start.setDate(start.getDate() - 7);
    }

    const sStr = toDateString(start);
    const eStr = toDateString(end);
    setStartDate(sStr);
    setEndDate(eStr);
  };

  // Location search inside historical page
  const handleLocationSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearchingLocation(true);
    try {
      const results = await searchGeocoding(searchQuery.trim());
      if (results && results.length > 0) {
        if (onSelectCity) onSelectCity(results[0].city || results[0].name);
        setSearchQuery('');
      } else {
        if (onSelectCity) onSelectCity(searchQuery.trim());
        setSearchQuery('');
      }
    } catch (err) {
      console.warn("Geocoding search failed:", err);
      if (onSelectCity) onSelectCity(searchQuery.trim());
    } finally {
      setIsSearchingLocation(false);
    }
  };

  // Export Table Data to CSV
  const handleExportCSV = () => {
    if (!historicalData || !historicalData.daily || historicalData.daily.length === 0) return;

    const headers = ["Date", "Condition", "Max_Temp_C", "Min_Temp_C", "Mean_Temp_C", "Precipitation_mm", "Rain_mm", "Max_Wind_kmh"];
    const rows = historicalData.daily.map(d => [
      d.date,
      `"${d.condition}"`,
      d.maxTemp,
      d.minTemp,
      d.meanTemp,
      d.precipitation,
      d.rain,
      d.windSpeed
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `weathergpt-historical-${currentCoords.name.toLowerCase()}-${startDate}-to-${endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const summary = historicalData?.summary;
  const days = historicalData?.daily || [];

  // Prepare points for SVG temperature trend line
  const chartWidth = 700;
  const chartHeight = 220;
  const padX = 45;
  const padY = 35;

  const tempChartData = useMemo(() => {
    if (!days || days.length === 0) return null;
    const allMax = days.map(d => d.maxTemp);
    const allMin = days.map(d => d.minTemp);
    const minVal = Math.min(...allMin) - 3;
    const maxVal = Math.max(...allMax) + 3;
    const range = maxVal - minVal || 1;

    const pointsMax = days.map((d, i) => ({
      x: padX + (i * (chartWidth - 2 * padX)) / Math.max(1, days.length - 1),
      y: chartHeight - padY - ((d.maxTemp - minVal) * (chartHeight - 2 * padY)) / range,
      val: d.maxTemp,
      date: d.date
    }));

    const pointsMin = days.map((d, i) => ({
      x: padX + (i * (chartWidth - 2 * padX)) / Math.max(1, days.length - 1),
      y: chartHeight - padY - ((d.minTemp - minVal) * (chartHeight - 2 * padY)) / range,
      val: d.minTemp,
      date: d.date
    }));

    const maxPath = pointsMax.reduce((acc, p, i) => i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`, '');
    const minPath = pointsMin.reduce((acc, p, i) => i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`, '');

    return { pointsMax, pointsMin, maxPath, minPath, minVal, maxVal };
  }, [days]);

  return (
    <div className="page-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        paddingBottom: '0.75rem',
        borderBottom: '1px solid var(--surface-border)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            padding: '0.65rem',
            borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-indigo))',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            boxShadow: '0 4px 12px rgba(56, 189, 248, 0.25)'
          }}>
            <CalendarRange size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 850, letterSpacing: '-0.02em', margin: 0 }}>
              {t('historicalArchiveTitle', 'Historical Weather Archive')}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', margin: 0, marginTop: '0.2rem' }}>
              {t('historicalArchiveSubtitle', 'Real atmospheric observations & reanalysis dataset powered by Open-Meteo & ECMWF ERA5')}
            </p>
          </div>
        </div>

        {onNavigateDashboard && (
          <button
            onClick={onNavigateDashboard}
            className="btn-secondary"
            style={{ padding: '0.45rem 0.85rem', fontSize: '0.82rem', gap: '0.35rem', cursor: 'pointer' }}
          >
            <ArrowLeft size={15} />
            <span>{t('backToDashboard', 'Back to Dashboard')}</span>
          </button>
        )}
      </div>

      {/* Control Panel: Location Search & Date Range Selectors */}
      <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          {/* Active Location Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              padding: '0.4rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--accent-glow)',
              color: 'var(--accent-blue)',
              display: 'flex',
              alignItems: 'center'
            }}>
              <MapPin size={18} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <strong style={{ fontSize: '1.05rem' }}>{currentCoords.name}</strong>
                {currentCoords.country && (
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>({currentCoords.country})</span>
                )}
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {t('coordinates', 'Coordinates')}: {currentCoords.lat.toFixed(2)}°, {currentCoords.lon.toFixed(2)}°
              </span>
            </div>
          </div>

          {/* Quick Location Switcher */}
          <form onSubmit={handleLocationSearch} style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Search size={15} style={{ position: 'absolute', left: '0.75rem', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder={t('searchPlaceholder', 'Change city for historical records...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: '0.45rem 0.75rem 0.45rem 2.2rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--surface-color)',
                  border: '1px solid var(--surface-border)',
                  fontSize: '0.82rem',
                  color: 'var(--text-primary)',
                  width: '240px'
                }}
              />
            </div>
            <button
              type="submit"
              disabled={isSearchingLocation || !searchQuery.trim()}
              className="btn-secondary"
              style={{ padding: '0.45rem 0.75rem', fontSize: '0.82rem', cursor: 'pointer' }}
            >
              {isSearchingLocation ? <RefreshCw size={14} className="animate-spin" /> : t('search', 'Search')}
            </button>
          </form>
        </div>

        {/* Date Presets & Custom Pickers */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          paddingTop: '0.85rem',
          borderTop: '1px solid var(--surface-border)'
        }}>
          {/* Preset Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginRight: '0.25rem' }}>
              {t('presets', 'Presets')}:
            </span>
            {[
              { id: '7d', label: t('last7Days', 'Last 7 Days') },
              { id: '14d', label: t('last14Days', 'Last 14 Days') },
              { id: '30d', label: t('last30Days', 'Last 30 Days') },
              { id: 'last_year', label: t('sameWeekLastYear', 'Same Week Last Year') }
            ].map(p => (
              <button
                key={p.id}
                onClick={() => applyPreset(p.id)}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.78rem',
                  fontWeight: activePreset === p.id ? 700 : 500,
                  background: activePreset === p.id ? 'var(--accent-glow)' : 'var(--surface-color)',
                  border: activePreset === p.id ? '1px solid var(--accent-blue)' : '1px solid var(--surface-border)',
                  color: activePreset === p.id ? 'var(--accent-blue)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Custom Date Pickers */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <label htmlFor="hist-start" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('from', 'From')}:</label>
              <input
                id="hist-start"
                type="date"
                max={endDate || maxAllowedDate}
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setActivePreset('custom');
                }}
                style={{
                  padding: '0.35rem 0.6rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--surface-color)',
                  border: '1px solid var(--surface-border)',
                  fontSize: '0.8rem',
                  color: 'var(--text-primary)'
                }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <label htmlFor="hist-end" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('to', 'To')}:</label>
              <input
                id="hist-end"
                type="date"
                min={startDate}
                max={maxAllowedDate}
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setActivePreset('custom');
                }}
                style={{
                  padding: '0.35rem 0.6rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--surface-color)',
                  border: '1px solid var(--surface-border)',
                  fontSize: '0.8rem',
                  color: 'var(--text-primary)'
                }}
              />
            </div>

            <button
              onClick={() => loadHistorical(startDate, endDate)}
              className="btn-primary"
              style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', gap: '0.35rem', cursor: 'pointer' }}
            >
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
              <span>{t('updateData', 'Update Data')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <Loading message={`${t('fetchingHistoricalFor', 'Fetching historical observations from Open-Meteo for')} ${currentCoords.name}...`} t={t} />
      ) : error ? (
        <ErrorMessage message={error} onRetry={() => loadHistorical(startDate, endDate)} t={t} />
      ) : historicalData ? (
        <>
          {/* Summary Metric Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem'
          }}>
            {/* Average Temperature */}
            <div className="glass-card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                <span>{t('periodAvgTemp', 'Period Average Temp')}</span>
                <Thermometer size={16} style={{ color: 'var(--accent-blue)' }} />
              </div>
              <span style={{ fontSize: '1.5rem', fontWeight: 850 }}>
                {formatTemperature(summary.avgTemp, tempUnit)}
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                {t('acrossDaysAnalyzed', `Across ${historicalData.daysCount} days analyzed`).replace('{count}', historicalData.daysCount)}
              </span>
            </div>

            {/* Max High */}
            <div className="glass-card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                <span>{t('peakMaxTemp', 'Peak Maximum Temp')}</span>
                <Thermometer size={16} style={{ color: '#f97316' }} />
              </div>
              <span style={{ fontSize: '1.5rem', fontWeight: 850, color: '#f97316' }}>
                {formatTemperature(summary.maxTemp, tempUnit)}
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                {t('highestRecordedDayHigh', 'Highest recorded day high')}
              </span>
            </div>

            {/* Min Low */}
            <div className="glass-card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                <span>{t('lowestMinTemp', 'Lowest Minimum Temp')}</span>
                <Thermometer size={16} style={{ color: '#38bdf8' }} />
              </div>
              <span style={{ fontSize: '1.5rem', fontWeight: 850, color: '#38bdf8' }}>
                {formatTemperature(summary.minTemp, tempUnit)}
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                {t('coldestRecordedNightLow', 'Coldest recorded night low')}
              </span>
            </div>

            {/* Total Rainfall */}
            <div className="glass-card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                <span>{t('totalPrecipitation', 'Total Precipitation')}</span>
                <Droplets size={16} style={{ color: 'var(--accent-cyan)' }} />
              </div>
              <span style={{ fontSize: '1.5rem', fontWeight: 850, color: 'var(--accent-cyan)' }}>
                {summary.totalPrecipitation} mm
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                {summary.rainyDays} {t('rainyDaysCount', 'rainy days recorded')}
              </span>
            </div>

            {/* Max Wind */}
            <div className="glass-card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                <span>{t('maxWindGust', 'Max Wind Gust')}</span>
                <Wind size={16} style={{ color: '#a855f7' }} />
              </div>
              <span style={{ fontSize: '1.5rem', fontWeight: 850 }}>
                {formatWind(summary.maxWindSpeed, windUnit)}
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                {t('peakWindVelocity', 'Peak 10m surface velocity')}
              </span>
            </div>
          </div>

          {/* Section: View Mode Switcher & Export */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button
                onClick={() => setViewMode('overview')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.4rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.82rem',
                  fontWeight: viewMode === 'overview' ? 750 : 500,
                  background: viewMode === 'overview' ? 'var(--accent-glow)' : 'var(--surface-card)',
                  border: viewMode === 'overview' ? '1px solid var(--accent-blue)' : '1px solid var(--surface-border)',
                  color: viewMode === 'overview' ? 'var(--accent-blue)' : 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                <LineChart size={15} />
                <span>{t('chartsAndTrends', 'Charts & Trends')}</span>
              </button>

              <button
                onClick={() => setViewMode('table')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.4rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.82rem',
                  fontWeight: viewMode === 'table' ? 750 : 500,
                  background: viewMode === 'table' ? 'var(--accent-glow)' : 'var(--surface-card)',
                  border: viewMode === 'table' ? '1px solid var(--accent-blue)' : '1px solid var(--surface-border)',
                  color: viewMode === 'table' ? 'var(--accent-blue)' : 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                <TableIcon size={15} />
                <span>{t('dailyTable', 'Daily Table')}</span>
              </button>
            </div>

            <button
              onClick={handleExportCSV}
              className="btn-secondary"
              style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', gap: '0.35rem' }}
              title={t('exportCSVTitle', 'Download historical data as a spreadsheet CSV')}
            >
              <Download size={14} />
              <span>{t('exportCSV', 'Export CSV')}</span>
            </button>
          </div>

          {/* Graphical Trends View */}
          {viewMode === 'overview' && tempChartData && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Temperature Trend SVG Chart */}
              <div className="glass-card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <TrendingUp size={18} style={{ color: 'var(--accent-blue)' }} />
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 750, margin: 0 }}>
                      {t('dailyTempEnvelope', 'Daily Temperature Envelope')} ({startDate} {t('to', 'to')} {endDate})
                    </h3>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.78rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f97316', display: 'inline-block' }} />
                      <span>{t('dailyMaxTemp', 'Daily Max Temp')}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#38bdf8', display: 'inline-block' }} />
                      <span>{t('dailyMinTemp', 'Daily Min Temp')}</span>
                    </div>
                  </div>
                </div>

                <div style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                  <svg
                    viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                    style={{ width: '100%', minWidth: '480px', height: 'auto', display: 'block' }}
                    role="img"
                    aria-label={t('historicalTempGraphAria', 'Historical temperature envelope graph')}
                  >
                    <title>{t('dailyTempEnvelope', 'Daily Temperature Envelope')}</title>

                    {/* Horizontal Grid lines */}
                    <line x1={padX} y1={padY} x2={chartWidth - padX} y2={padY} stroke="var(--surface-border)" strokeDasharray="3" />
                    <line x1={padX} y1={chartHeight / 2} x2={chartWidth - padX} y2={chartHeight / 2} stroke="var(--surface-border)" strokeDasharray="3" />
                    <line x1={padX} y1={chartHeight - padY} x2={chartWidth - padX} y2={chartHeight - padY} stroke="var(--surface-border)" strokeDasharray="3" />

                    {/* Y-axis Labels */}
                    <text x={padX - 8} y={padY + 4} fill="var(--text-muted)" fontSize="10" textAnchor="end">
                      {formatTemperature(tempChartData.maxVal, tempUnit)}
                    </text>
                    <text x={padX - 8} y={chartHeight / 2 + 4} fill="var(--text-muted)" fontSize="10" textAnchor="end">
                      {formatTemperature(Math.round((tempChartData.maxVal + tempChartData.minVal) / 2), tempUnit)}
                    </text>
                    <text x={padX - 8} y={chartHeight - padY + 4} fill="var(--text-muted)" fontSize="10" textAnchor="end">
                      {formatTemperature(tempChartData.minVal, tempUnit)}
                    </text>

                    {/* Max Temp Line */}
                    <path
                      d={tempChartData.maxPath}
                      fill="none"
                      stroke="#f97316"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />

                    {/* Min Temp Line */}
                    <path
                      d={tempChartData.minPath}
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />

                    {/* Points & Date X labels */}
                    {tempChartData.pointsMax.map((p, i) => {
                      const showLabel = days.length <= 15 || i % Math.ceil(days.length / 10) === 0 || i === days.length - 1;
                      const dateShort = p.date.slice(5); // MM-DD
                      return (
                        <g key={i}>
                          <circle cx={p.x} cy={p.y} r="3.5" fill="#f97316" />
                          <circle cx={tempChartData.pointsMin[i].x} cy={tempChartData.pointsMin[i].y} r="3.5" fill="#38bdf8" />
                          {showLabel && (
                            <text
                              x={p.x}
                              y={chartHeight - 10}
                              fill="var(--text-muted)"
                              fontSize="9.5"
                              textAnchor="middle"
                            >
                              {dateShort}
                            </text>
                          )}
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>

              {/* Daily Precipitation Bar Chart */}
              <div className="glass-card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem' }}>
                  <Droplets size={18} style={{ color: 'var(--accent-cyan)' }} />
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 750, margin: 0 }}>
                    {t('dailyRecordedPrecipitation', 'Daily Recorded Precipitation (mm)')}
                  </h3>
                </div>

                <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', paddingBottom: '0.5rem' }}>
                  <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    minWidth: `${Math.max(480, days.length * 35)}px`,
                    alignItems: 'flex-end',
                    height: '140px',
                    paddingTop: '1.5rem',
                    borderBottom: '1px solid var(--surface-border)'
                  }}>
                    {days.map((d, i) => {
                      const maxRain = Math.max(5, ...days.map(x => x.precipitation));
                      const barHeight = Math.max(4, (d.precipitation / maxRain) * 100);
                      const hasRain = d.precipitation > 0;
                      return (
                        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end', gap: '0.35rem' }}>
                          <span style={{ fontSize: '0.68rem', fontWeight: 700, color: hasRain ? 'var(--accent-cyan)' : 'var(--text-muted)' }}>
                            {d.precipitation}
                          </span>
                          <div
                            title={`${d.date}: ${d.precipitation} mm`}
                            style={{
                              width: '100%',
                              maxWidth: '22px',
                              height: `${hasRain ? barHeight : 3}px`,
                              background: hasRain ? 'linear-gradient(to top, #0284c7, #38bdf8)' : 'var(--surface-border)',
                              borderRadius: '3px 3px 0 0',
                              transition: 'height 0.3s ease'
                            }}
                          />
                          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                            {d.date.slice(8)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Daily Records Tabular View */}
          {(viewMode === 'table' || !tempChartData) && (
            <div className="glass-card" style={{ padding: '1.25rem', overflowX: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 750, margin: 0 }}>
                  {t('dailyRecords', 'Detailed Daily Atmospheric Telemetry')} ({days.length} {t('records', 'Records')})
                </h3>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--surface-border)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.65rem', textAlign: 'left' }}>{t('date', 'Date')}</th>
                    <th style={{ padding: '0.65rem', textAlign: 'left' }}>{t('condition', 'Condition')}</th>
                    <th style={{ padding: '0.65rem', textAlign: 'right' }}>{t('maxTemp', 'Max Temp')}</th>
                    <th style={{ padding: '0.65rem', textAlign: 'right' }}>{t('minTemp', 'Min Temp')}</th>
                    <th style={{ padding: '0.65rem', textAlign: 'right' }}>{t('meanTemp', 'Mean Temp')}</th>
                    <th style={{ padding: '0.65rem', textAlign: 'right' }}>{t('precipitation', 'Precipitation')}</th>
                    <th style={{ padding: '0.65rem', textAlign: 'right' }}>{t('maxWind', 'Max Wind')}</th>
                  </tr>
                </thead>
                <tbody>
                  {days.map((day, idx) => (
                    <tr
                      key={day.date}
                      style={{
                        borderBottom: '1px solid var(--surface-border)',
                        background: idx % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.02)'
                      }}
                    >
                      <td style={{ padding: '0.65rem', fontWeight: 650 }}>{day.date}</td>
                      <td style={{ padding: '0.65rem', color: 'var(--text-secondary)' }}>{localizeCondition(day.condition, lang)}</td>
                      <td style={{ padding: '0.65rem', textAlign: 'right', color: '#f97316', fontWeight: 700 }}>
                        {formatTemperature(day.maxTemp, tempUnit)}
                      </td>
                      <td style={{ padding: '0.65rem', textAlign: 'right', color: '#38bdf8', fontWeight: 700 }}>
                        {formatTemperature(day.minTemp, tempUnit)}
                      </td>
                      <td style={{ padding: '0.65rem', textAlign: 'right' }}>
                        {formatTemperature(day.meanTemp, tempUnit)}
                      </td>
                      <td style={{ padding: '0.65rem', textAlign: 'right', color: day.precipitation > 0 ? 'var(--accent-cyan)' : 'var(--text-muted)', fontWeight: day.precipitation > 0 ? 700 : 400 }}>
                        {day.precipitation} mm
                      </td>
                      <td style={{ padding: '0.65rem', textAlign: 'right' }}>
                        {formatWind(day.windSpeed, windUnit)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Dataset Attribution & Integrity Notice */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            padding: '0.5rem 0.75rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--surface-color)',
            border: '1px solid var(--surface-border)'
          }}>
            <Info size={14} style={{ color: 'var(--accent-blue)', flexShrink: 0 }} />
            <span>
              {t('historicalAttribution', 'Historical telemetry sourced from Open-Meteo Historical Weather API based on ECMWF ERA5 Global Atmospheric Reanalysis model.')}
            </span>
          </div>
        </>
      ) : null}
    </div>
  );
}
