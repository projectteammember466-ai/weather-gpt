import React, { useState, useEffect } from 'react';
import { 
  ArrowLeftRight, Search, MapPin, Sparkles, Thermometer, 
  Droplets, Wind, Sun, Compass, ShieldCheck, RefreshCw, AlertCircle, Clock 
} from 'lucide-react';
import { fetchWeather, searchGeocoding, fetchWeatherByCoords } from '../services/api';
import { formatTemperature } from '../utils/formatTemperature';
import { formatWind } from '../utils/formatWind';
import { localizeCondition } from '../data/translations';
import { getContextMode } from '../data/contextModes';
import { Loading } from '../components/states/Loading';
import { ErrorMessage } from '../components/states/ErrorMessage';
import { useSavedLocations } from '../hooks/useSavedLocations';

export function CompareWeather({ 
  initialCityA = 'jodhpur', 
  initialCityB = 'jaipur', 
  tempUnit = 'C', 
  windUnit = 'kmh', 
  userMode = 'general', 
  savedLocations = [], 
  lang = 'en', 
  t = (k, f) => f || k 
}) {
  const { savedLocations: fallbackSaved } = useSavedLocations();
  const effectiveSaved = savedLocations && savedLocations.length > 0 ? savedLocations : fallbackSaved;

  const [cityA, setCityA] = useState(initialCityA);
  const [cityB, setCityB] = useState(initialCityB);
  
  const [queryA, setQueryA] = useState('');
  const [queryB, setQueryB] = useState('');
  const [suggestionsA, setSuggestionsA] = useState([]);
  const [suggestionsB, setSuggestionsB] = useState([]);

  const [weatherA, setWeatherA] = useState(null);
  const [weatherB, setWeatherB] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentMode = getContextMode(userMode);
  const modeName = currentMode.names[lang] || currentMode.names.en;

  // Load weather for both cities
  const loadComparison = async (targetA, targetB) => {
    setLoading(true);
    setError(null);
    try {
      const [resA, resB] = await Promise.all([
        fetchWeather(targetA),
        fetchWeather(targetB)
      ]);
      setWeatherA(resA);
      setWeatherB(resB);
    } catch (err) {
      setError(t('errorDefault', "Weather data couldn't be loaded. Please check your query or try again."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComparison(cityA, cityB);
  }, [cityA, cityB]);

  // Swap Locations
  const handleSwap = () => {
    const temp = cityA;
    setCityA(cityB);
    setCityB(temp);
  };

  // Search geocoding debounce for input A
  useEffect(() => {
    if (!queryA || queryA.trim().length < 2) {
      setSuggestionsA([]);
      return;
    }
    const timer = setTimeout(async () => {
      const res = await searchGeocoding(queryA);
      setSuggestionsA(res || []);
    }, 250);
    return () => clearTimeout(timer);
  }, [queryA]);

  // Search geocoding debounce for input B
  useEffect(() => {
    if (!queryB || queryB.trim().length < 2) {
      setSuggestionsB([]);
      return;
    }
    const timer = setTimeout(async () => {
      const res = await searchGeocoding(queryB);
      setSuggestionsB(res || []);
    }, 250);
    return () => clearTimeout(timer);
  }, [queryB]);

  // Generate Context-Aware Factual Comparison Explanation
  const generateComparisonInsight = () => {
    if (!weatherA || !weatherB) return '';

    const nameA = weatherA.location?.city || cityA;
    const nameB = weatherB.location?.city || cityB;
    const tempA = weatherA.current?.temperature ?? 30;
    const tempB = weatherB.current?.temperature ?? 30;
    const rainA = weatherA.current?.rainProbability ?? 10;
    const rainB = weatherB.current?.rainProbability ?? 10;
    const windA = weatherA.current?.windSpeed ?? 12;
    const windB = weatherB.current?.windSpeed ?? 12;
    const uvA = weatherA.current?.uvIndex ?? 6;
    const uvB = weatherB.current?.uvIndex ?? 6;
    const humA = weatherA.current?.humidity ?? 45;
    const humB = weatherB.current?.humidity ?? 45;

    const tempDiff = Math.abs(tempA - tempB);
    const warmerCity = tempA > tempB ? nameA : nameB;

    if (userMode === 'traveler') {
      return lang === 'hi'
        ? `${nameA} में तापमान ${tempA}°C और बारिश की संभावना ${rainA}% है, जबकि ${nameB} में ${tempB}°C और ${rainB}% है। हवा की गति ${nameA} में ${windA} km/h और ${nameB} में ${windB} km/h दर्ज की गई है।`
        : lang === 'hinglish'
        ? `${nameA} mein temperature ${tempA}°C aur rain probability ${rainA}% hai, jabki ${nameB} mein ${tempB}°C aur ${rainB}% hai. Visibility aur travel comfort ke liye dono cities ke metrics factual hain.`
        : `${nameA} currently registers ${tempA}°C with ${rainA}% rain probability, compared to ${tempB}°C and ${rainB}% in ${nameB}. Wind velocity is ${windA} km/h in ${nameA} versus ${windB} km/h in ${nameB}.`;
    }

    if (userMode === 'farmer') {
      return lang === 'hi'
        ? `${nameA} में वर्षा की संभावना ${rainA}% और आर्द्रता ${humA}% है, जबकि ${nameB} में वर्षा संभावना ${rainB}% और आर्द्रता ${humB}% है। कृषि छिड़काव के लिए दोनों स्थानों पर हवा की गति पर नजर रखें।`
        : lang === 'hinglish'
        ? `${nameA} mein rain chance ${rainA}% aur humidity ${humA}% hai, jabki ${nameB} mein ${rainB}% precipitation potential hai. Wind speed ${nameA} mein ${windA} km/h aur ${nameB} mein ${windB} km/h hai.`
        : `${nameA} indicates ${rainA}% rain chance with ${humA}% humidity, while ${nameB} shows ${rainB}% rain probability and ${humB}% humidity. Wind velocities are ${windA} km/h and ${windB} km/h respectively.`;
    }

    if (userMode === 'outdoor' || userMode === 'fitness') {
      return lang === 'hi'
        ? `${nameA} का तापमान ${tempA}°C और यूवी स्तर ${uvA} है, जबकि ${nameB} में ${tempB}°C और यूवी ${uvB} है। कसरत और आउटडोर खेल के लिए दोनों स्थानों के मौसम अंतर स्पष्ट हैं।`
        : lang === 'hinglish'
        ? `${nameA} ka temperature ${tempA}°C aur UV index ${uvA} hai, jabki ${nameB} mein ${tempB}°C aur UV ${uvB} hai. Heat aur hydration exposure ko dhyan mein rakhein.`
        : `${nameA} exhibits ${tempA}°C with a UV index of ${uvA}, whereas ${nameB} registers ${tempB}°C with UV ${uvB}. Outdoor activity comfort is influenced by the ${tempDiff}°C thermal divergence.`;
    }

    // General Mode
    return lang === 'hi'
      ? `${nameA} का तापमान ${tempA}°C है जबकि ${nameB} में ${tempB}°C है (${tempDiff}°C का अंतर)। बारिश की संभावना ${nameA} में ${rainA}% और ${nameB} में ${rainB}% है।`
      : lang === 'hinglish'
      ? `${nameA} mein temperature ${tempA}°C hai aur ${nameB} mein ${tempB}°C hai (${tempDiff}°C difference). Rain probability ${nameA} mein ${rainA}% aur ${nameB} mein ${rainB}% hai.`
      : `${nameA} is currently ${tempA}°C with ${localizeCondition(weatherA.current?.condition, lang)}, while ${nameB} is ${tempB}°C with ${localizeCondition(weatherB.current?.condition, lang)}. Precipitation probability stands at ${rainA}% in ${nameA} versus ${rainB}% in ${nameB}.`;
  };

  return (
    <div className="page-fade-in" style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <div style={{
            padding: '0.4rem',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--accent-glow)',
            color: 'var(--accent-blue)'
          }}>
            <ArrowLeftRight size={20} />
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 850, margin: 0 }}>
            {t('compareWeather', 'Compare Weather')}
          </h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0 }}>
          {t('compareSubtitle', 'Compare real-time weather metrics side-by-side between any two cities.')}
        </p>
      </div>

      {/* City Pickers Box */}
      <div className="glass-card" style={{ padding: '1.25rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          gap: '0.75rem',
          alignItems: 'center'
        }}>
          {/* Location A Input */}
          <div style={{ position: 'relative' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 750, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
              {t('locationA', 'Location A')}
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={queryA}
                onChange={(e) => setQueryA(e.target.value)}
                placeholder={weatherA?.location?.city || cityA}
                className="input-base"
                style={{ width: '100%', paddingLeft: '2rem', fontSize: '0.88rem' }}
              />
              <Search size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>

            {/* Suggestions Dropdown A */}
            {suggestionsA.length > 0 && (
              <div 
                className="glass-card"
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  zIndex: 20,
                  marginTop: '0.25rem',
                  maxHeight: '200px',
                  overflowY: 'auto',
                  padding: '0.4rem'
                }}
              >
                {suggestionsA.map((s) => (
                  <div
                    key={s.id || s.name}
                    onClick={() => {
                      setCityA(s.city || s.name);
                      setQueryA('');
                      setSuggestionsA([]);
                    }}
                    style={{
                      padding: '0.5rem 0.65rem',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      fontSize: '0.82rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}
                    className="dropdown-item"
                  >
                    <MapPin size={13} style={{ color: 'var(--accent-blue)' }} />
                    <span>{s.displayName || `${s.name}, ${s.country}`}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Swap Button */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.2rem' }}>
            <button
              onClick={handleSwap}
              className="btn-secondary"
              style={{
                borderRadius: 'var(--radius-full)',
                padding: '0.55rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              title={t('swapLocations', 'Swap Locations')}
              aria-label={t('swapLocations', 'Swap Locations')}
            >
              <ArrowLeftRight size={18} />
            </button>
          </div>

          {/* Location B Input */}
          <div style={{ position: 'relative' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 750, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
              {t('locationB', 'Location B')}
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={queryB}
                onChange={(e) => setQueryB(e.target.value)}
                placeholder={weatherB?.location?.city || cityB}
                className="input-base"
                style={{ width: '100%', paddingLeft: '2rem', fontSize: '0.88rem' }}
              />
              <Search size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>

            {/* Suggestions Dropdown B */}
            {suggestionsB.length > 0 && (
              <div 
                className="glass-card"
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  zIndex: 20,
                  marginTop: '0.25rem',
                  maxHeight: '200px',
                  overflowY: 'auto',
                  padding: '0.4rem'
                }}
              >
                {suggestionsB.map((s) => (
                  <div
                    key={s.id || s.name}
                    onClick={() => {
                      setCityB(s.city || s.name);
                      setQueryB('');
                      setSuggestionsB([]);
                    }}
                    style={{
                      padding: '0.5rem 0.65rem',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      fontSize: '0.82rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}
                    className="dropdown-item"
                  >
                    <MapPin size={13} style={{ color: 'var(--accent-blue)' }} />
                    <span>{s.displayName || `${s.name}, ${s.country}`}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick select from saved locations if present */}
        {effectiveSaved.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.85rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>
              {t('quickSavedCities', 'Quick Pick')}:
            </span>
            {effectiveSaved.slice(0, 5).map((loc) => (
              <button
                key={loc.city || loc.name}
                onClick={() => {
                  if (cityA.toLowerCase() === (loc.city || loc.name).toLowerCase()) {
                    setCityB(loc.city || loc.name);
                  } else {
                    setCityA(loc.city || loc.name);
                  }
                }}
                className="btn-secondary"
                style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem', borderRadius: 'var(--radius-full)' }}
              >
                {loc.city || loc.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Comparison Area */}
      {loading ? (
        <Loading message={t('loading', 'Loading comparison telemetry...')} t={t} />
      ) : error ? (
        <ErrorMessage message={error} onRetry={() => loadComparison(cityA, cityB)} t={t} />
      ) : weatherA && weatherB ? (
        <>
          {/* Side-by-Side Hero Comparison Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1rem'
          }}>
            {/* City A Card */}
            <div className="glass-card" style={{ padding: '1.5rem', borderTop: '3px solid var(--accent-blue)' }}>
              <span className="badge badge-info" style={{ fontSize: '0.68rem', marginBottom: '0.5rem' }}>
                {t('locationA', 'Location A')}
              </span>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 850, margin: '0 0 0.2rem 0' }}>
                {weatherA.location?.city || cityA}
              </h2>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {weatherA.location?.region || weatherA.location?.country}
              </span>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', margin: '1rem 0' }}>
                <span style={{ fontSize: '2.75rem', fontWeight: 850, color: 'var(--accent-blue)', lineHeight: 1 }}>
                  {formatTemperature(weatherA.current?.temperature, tempUnit)}
                </span>
                <div>
                  <span style={{ fontSize: '1.05rem', fontWeight: 700, display: 'block' }}>
                    {localizeCondition(weatherA.current?.condition, lang)}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {t('feelsLike', 'Feels Like')} {formatTemperature(weatherA.current?.feelsLike, tempUnit)}
                  </span>
                </div>
              </div>
            </div>

            {/* City B Card */}
            <div className="glass-card" style={{ padding: '1.5rem', borderTop: '3px solid #f97316' }}>
              <span className="badge badge-warning" style={{ fontSize: '0.68rem', marginBottom: '0.5rem' }}>
                {t('locationB', 'Location B')}
              </span>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 850, margin: '0 0 0.2rem 0' }}>
                {weatherB.location?.city || cityB}
              </h2>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {weatherB.location?.region || weatherB.location?.country}
              </span>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', margin: '1rem 0' }}>
                <span style={{ fontSize: '2.75rem', fontWeight: 850, color: '#f97316', lineHeight: 1 }}>
                  {formatTemperature(weatherB.current?.temperature, tempUnit)}
                </span>
                <div>
                  <span style={{ fontSize: '1.05rem', fontWeight: 700, display: 'block' }}>
                    {localizeCondition(weatherB.current?.condition, lang)}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {t('feelsLike', 'Feels Like')} {formatTemperature(weatherB.current?.feelsLike, tempUnit)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Context-Aware Factual Explanation Card */}
          <div className="glass-card" style={{ padding: '1.25rem', borderColor: 'rgba(56, 189, 248, 0.25)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Sparkles size={18} style={{ color: 'var(--accent-blue)' }} />
              <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0 }}>
                {t('compareInsight', 'Context-Aware Comparison Insight')} ({modeName})
              </h3>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
              {generateComparisonInsight()}
            </p>
          </div>

          {/* Detailed Metric Comparison Table */}
          <div className="glass-card" style={{ padding: '1.25rem', overflowX: 'auto' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '1rem' }}>
              {t('detailedMetrics', 'Detailed Atmospheric Metrics')}
            </h3>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--surface-border)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.65rem', textAlign: 'left' }}>Metric</th>
                  <th style={{ padding: '0.65rem', textAlign: 'right' }}>{weatherA.location?.city}</th>
                  <th style={{ padding: '0.65rem', textAlign: 'right' }}>{weatherB.location?.city}</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: t('temperature', 'Temperature'), valA: formatTemperature(weatherA.current?.temperature, tempUnit), valB: formatTemperature(weatherB.current?.temperature, tempUnit) },
                  { label: t('feelsLike', 'Feels Like'), valA: formatTemperature(weatherA.current?.feelsLike, tempUnit), valB: formatTemperature(weatherB.current?.feelsLike, tempUnit) },
                  { label: t('condition', 'Condition'), valA: localizeCondition(weatherA.current?.condition, lang), valB: localizeCondition(weatherB.current?.condition, lang) },
                  { label: t('rainChance', 'Rain Probability'), valA: `${weatherA.current?.rainProbability ?? 0}%`, valB: `${weatherB.current?.rainProbability ?? 0}%` },
                  { label: t('humidity', 'Humidity'), valA: `${weatherA.current?.humidity ?? 45}%`, valB: `${weatherB.current?.humidity ?? 45}%` },
                  { label: t('wind', 'Wind Speed'), valA: formatWind(weatherA.current?.windSpeed, windUnit, weatherA.current?.windDirection), valB: formatWind(weatherB.current?.windSpeed, windUnit, weatherB.current?.windDirection) },
                  { label: t('uvIndex', 'UV Index'), valA: weatherA.current?.uvIndex ?? 6, valB: weatherB.current?.uvIndex ?? 6 },
                  { label: t('airQuality', 'Air Quality (AQI)'), valA: weatherA.current?.aqi ?? 75, valB: weatherB.current?.aqi ?? 75 },
                  { label: t('pressure', 'Pressure'), valA: `${weatherA.current?.pressure ?? 1012} hPa`, valB: `${weatherB.current?.pressure ?? 1012} hPa` },
                  { label: t('cloudCover', 'Cloud Cover'), valA: `${weatherA.current?.cloudCover ?? 20}%`, valB: `${weatherB.current?.cloudCover ?? 20}%` }
                ].map((row, idx) => (
                  <tr
                    key={row.label}
                    style={{
                      borderBottom: '1px solid var(--surface-border)',
                      background: idx % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.02)'
                    }}
                  >
                    <td style={{ padding: '0.65rem', fontWeight: 650, color: 'var(--text-secondary)' }}>{row.label}</td>
                    <td style={{ padding: '0.65rem', textAlign: 'right', fontWeight: 750, color: 'var(--accent-blue)' }}>{row.valA}</td>
                    <td style={{ padding: '0.65rem', textAlign: 'right', fontWeight: 750, color: '#f97316' }}>{row.valB}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : null}
    </div>
  );
}
