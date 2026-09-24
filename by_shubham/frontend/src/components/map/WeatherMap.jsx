import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { 
  MapPin, Table, ShieldAlert, Thermometer, Droplets, Wind, Cloud, 
  Activity, Compass, Globe, Info, RefreshCw, Check, Layers
} from 'lucide-react';
import { ALL_DEMO_CITIES, getMockWeather } from '../../data/weatherData';
import { 
  fetchNearbyLocationsWeather, 
  fetchWeatherByCoords, 
  getGoogleMapsApiKey, 
  searchGeocoding 
} from '../../services/api';
import { formatTemperature } from '../../utils/formatTemperature';
import { formatWind } from '../../utils/formatWind';
import { MapLayerSelector } from './MapLayerSelector';
import { localizeCondition } from '../../data/translations';

// Helper component to center and zoom map smoothly when selected location changes
function MapRecenter({ center, zoom = 10 }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.flyTo(center, zoom, {
        animate: true,
        duration: 1.2
      });
    }
  }, [center, zoom, map]);
  return null;
}

export function WeatherMap({
  selectedCity = 'jodhpur',
  onSelectCity,
  activeLayer = 'temperature',
  onSelectLayer,
  geoCoords,
  location,
  weather,
  tempUnit = 'C',
  windUnit = 'kmh',
  lang = 'en',
  t = (k, f) => f || k
}) {
  const [showAccessibleList, setShowAccessibleList] = useState(false);
  const [nearbyStations, setNearbyStations] = useState([]);
  const [loadingNearby, setLoadingNearby] = useState(false);
  const [mapProvider, setMapProvider] = useState('google_roadmap'); // 'google_roadmap' | 'google_satellite' | 'google_terrain' | 'osm'
  const [customCoords, setCustomCoords] = useState(null);

  const googleKey = getGoogleMapsApiKey();

  // Determine demo city match if available
  const cityMock = useMemo(() => {
    return ALL_DEMO_CITIES.find(
      c => c.city.toLowerCase() === selectedCity.toLowerCase() || c.name.toLowerCase() === selectedCity.toLowerCase()
    ) || ALL_DEMO_CITIES[0];
  }, [selectedCity]);

  // Asynchronously resolve authentic coordinates for any custom searched city
  useEffect(() => {
    const clean = selectedCity?.trim().toLowerCase();
    if (!clean) return;

    // Check if city is an exact match in demo fixtures
    const isDemo = ALL_DEMO_CITIES.some(
      c => c.city.toLowerCase() === clean || c.name.toLowerCase() === clean
    );
    if (isDemo) {
      setCustomCoords(null);
      return;
    }

    // Check if current weather prop already carries accurate coordinates for this city
    if (
      weather?.location?.city?.toLowerCase() === clean &&
      weather.location.lat &&
      weather.location.lon &&
      !(weather.location.lat === 20 && weather.location.lon === 77)
    ) {
      setCustomCoords(null);
      return;
    }

    // Perform high-precision geocoding lookup
    let isMounted = true;
    searchGeocoding(selectedCity)
      .then(results => {
        if (isMounted && results && results.length > 0) {
          setCustomCoords({
            lat: results[0].lat,
            lon: results[0].lon,
            name: results[0].city || results[0].name || selectedCity,
            country: results[0].country || 'India'
          });
        }
      })
      .catch(err => {
        console.warn("Geocoding lookup failed in WeatherMap for:", selectedCity, err);
      });

    return () => { isMounted = false; };
  }, [selectedCity, weather]);

  // Dynamically resolve exact coordinates for any searched or detected city worldwide
  const resolvedCoords = useMemo(() => {
    // 1. Explicit location object with coordinates (from weather.location or geocoding)
    if (location && (location.latitude || location.lat) && (location.longitude || location.lon)) {
      const lat = Number(location.latitude ?? location.lat);
      const lon = Number(location.longitude ?? location.lon);
      if (!isNaN(lat) && !isNaN(lon) && !(lat === 20 && lon === 77)) {
        return {
          lat,
          lon,
          name: location.city || location.name || selectedCity,
          country: location.country || ''
        };
      }
    }
    // 2. Weather object with coordinates
    if (weather?.location && (weather.location.latitude || weather.location.lat) && (weather.location.longitude || weather.location.lon)) {
      const lat = Number(weather.location.latitude ?? weather.location.lat);
      const lon = Number(weather.location.longitude ?? weather.location.lon);
      if (!isNaN(lat) && !isNaN(lon) && !(lat === 20 && lon === 77)) {
        return {
          lat,
          lon,
          name: weather.location.city || weather.location.name || selectedCity,
          country: weather.location.country || ''
        };
      }
    }
    // 3. Custom async geocoded coordinates
    if (customCoords && customCoords.lat && customCoords.lon) {
      return customCoords;
    }
    // 4. Exact demo city match
    const exactDemo = ALL_DEMO_CITIES.find(
      c => c.city.toLowerCase() === selectedCity.toLowerCase() || c.name.toLowerCase() === selectedCity.toLowerCase()
    );
    if (exactDemo) {
      return {
        lat: exactDemo.lat,
        lon: exactDemo.lon,
        name: exactDemo.name,
        country: exactDemo.country || 'India'
      };
    }
    // 5. Browser geolocation coordinates if available
    if (geoCoords && geoCoords.latitude && geoCoords.longitude) {
      return {
        lat: Number(geoCoords.latitude),
        lon: Number(geoCoords.longitude),
        name: location?.city || selectedCity || 'Current Location',
        country: location?.country || ''
      };
    }
    // 6. Fallback to default Jodhpur
    return {
      lat: ALL_DEMO_CITIES[0].lat,
      lon: ALL_DEMO_CITIES[0].lon,
      name: selectedCity || ALL_DEMO_CITIES[0].name,
      country: 'India'
    };
  }, [location, weather, geoCoords, selectedCity, customCoords]);

  const mapCenter = useMemo(() => {
    return [resolvedCoords.lat, resolvedCoords.lon];
  }, [resolvedCoords.lat, resolvedCoords.lon]);

  // Live atmospheric telemetry for the center location
  const centerWeatherData = useMemo(() => {
    if (weather && weather.current) {
      return {
        temp: weather.current.temperature,
        condition: weather.current.condition,
        rainProbability: weather.current.rainProbability,
        windSpeed: weather.current.windSpeed,
        windDirection: weather.current.windDirection,
        cloudCover: weather.current.cloudCover,
        humidity: weather.current.humidity,
        aqi: weather.current.aqi,
        hasAlert: (weather.alerts && weather.alerts.length > 0) || false
      };
    }
    return {
      temp: cityMock.temp,
      condition: cityMock.condition,
      rainProbability: cityMock.rainProbability,
      windSpeed: cityMock.windSpeed,
      windDirection: cityMock.windDirection,
      cloudCover: cityMock.cloudCover,
      humidity: cityMock.humidity,
      aqi: cityMock.aqi,
      hasAlert: cityMock.hasAlert
    };
  }, [weather, cityMock]);

  // Load live nearby station telemetry whenever selected coordinates change
  useEffect(() => {
    let isMounted = true;
    async function loadNearby() {
      setLoadingNearby(true);
      try {
        const stations = await fetchNearbyLocationsWeather(resolvedCoords.lat, resolvedCoords.lon, resolvedCoords.name);
        if (isMounted) {
          setNearbyStations(stations);
        }
      } catch (err) {
        console.warn("Could not load nearby stations:", err);
      } finally {
        if (isMounted) setLoadingNearby(false);
      }
    }
    loadNearby();
    return () => { isMounted = false; };
  }, [resolvedCoords.lat, resolvedCoords.lon, resolvedCoords.name]);

  // Helper to generate dynamic divIcon HTML for Leaflet markers based on active layer
  const createMarkerIcon = (stationName, stationData, isSelected) => {
    let layerValue = formatTemperature(stationData.temp !== undefined ? stationData.temp : centerWeatherData.temp, tempUnit);
    
    if (activeLayer === 'rain') {
      layerValue = `${stationData.rainProbability || 10}% Rain`;
    } else if (activeLayer === 'wind') {
      layerValue = formatWind(stationData.windSpeed || 12, windUnit, stationData.windDirection || 'NW');
    } else if (activeLayer === 'clouds') {
      layerValue = `${stationData.cloudCover || 20}% Cloud`;
    } else if (activeLayer === 'aqi') {
      layerValue = `AQI ${stationData.aqi || 80}`;
    } else if (activeLayer === 'alerts') {
      layerValue = stationData.hasAlert ? 'ALERT' : 'Normal';
    }

    const htmlContent = `
      <div class="map-marker-pin ${isSelected ? 'map-marker-selected' : 'map-marker-nearby'}">
        <span style="font-weight: 700;">${stationName}</span>
        <strong style="margin-left: 2px;">${layerValue}</strong>
      </div>
    `;

    return L.divIcon({
      className: 'leaflet-custom-icon',
      html: htmlContent,
      iconSize: [130, 36],
      iconAnchor: [65, 18]
    });
  };

  return (
    <div className="glass-card" style={{ padding: '1.25rem' }}>
      {/* Map Header & Accessibility Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            padding: '0.45rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--accent-glow)',
            color: 'var(--accent-blue)',
            display: 'flex',
            alignItems: 'center'
          }}>
            <MapPin size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 850, letterSpacing: '-0.01em', margin: 0 }}>
                {t('radarMapTitle', 'Real Geospatial Weather Map & Radar')}
              </h2>
              {mapProvider.startsWith('google') && (
                <span className="badge badge-success" style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }}></span>
                  Google Maps Active
                </span>
              )}
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {mapProvider.startsWith('google') 
                ? 'Google Maps Basemap • High-Precision Radar Telemetry • Click pins or chips to sync'
                : 'OpenStreetMap Basemap • Open-Meteo Telemetry • Click pins or chips to sync'}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {/* Map Provider Selector Pills */}
          <div style={{
            display: 'flex',
            background: 'var(--surface-color)',
            border: '1px solid var(--surface-border)',
            borderRadius: 'var(--radius-md)',
            padding: '0.2rem',
            gap: '0.2rem'
          }}>
            <button
              type="button"
              onClick={() => setMapProvider('google_roadmap')}
              style={{
                padding: '0.3rem 0.6rem',
                fontSize: '0.75rem',
                fontWeight: mapProvider === 'google_roadmap' ? 700 : 500,
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: mapProvider === 'google_roadmap' ? 'var(--accent-blue)' : 'transparent',
                color: mapProvider === 'google_roadmap' ? '#fff' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              title="Google Maps Standard Roadmap"
            >
              Google Map
            </button>
            <button
              type="button"
              onClick={() => setMapProvider('google_satellite')}
              style={{
                padding: '0.3rem 0.6rem',
                fontSize: '0.75rem',
                fontWeight: mapProvider === 'google_satellite' ? 700 : 500,
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: mapProvider === 'google_satellite' ? 'var(--accent-blue)' : 'transparent',
                color: mapProvider === 'google_satellite' ? '#fff' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              title="Google Maps Satellite Hybrid"
            >
              Satellite
            </button>
            <button
              type="button"
              onClick={() => setMapProvider('google_terrain')}
              style={{
                padding: '0.3rem 0.6rem',
                fontSize: '0.75rem',
                fontWeight: mapProvider === 'google_terrain' ? 700 : 500,
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: mapProvider === 'google_terrain' ? 'var(--accent-blue)' : 'transparent',
                color: mapProvider === 'google_terrain' ? '#fff' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              title="Google Maps Terrain"
            >
              Terrain
            </button>
            <button
              type="button"
              onClick={() => setMapProvider('osm')}
              style={{
                padding: '0.3rem 0.6rem',
                fontSize: '0.75rem',
                fontWeight: mapProvider === 'osm' ? 700 : 500,
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: mapProvider === 'osm' ? 'var(--accent-blue)' : 'transparent',
                color: mapProvider === 'osm' ? '#fff' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              title="OpenStreetMap"
            >
              OSM
            </button>
          </div>

          <button
            onClick={() => setShowAccessibleList(!showAccessibleList)}
            className="btn-secondary"
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.35rem', cursor: 'pointer' }}
            aria-label={showAccessibleList ? t('viewInteractiveMap', 'View Interactive Map') : t('accessibleList', 'Accessible Location List')}
          >
            <Table size={15} />
            <span>{showAccessibleList ? t('viewInteractiveMap', 'View Interactive Map') : t('accessibleList', 'Accessible Location List')}</span>
          </button>
        </div>
      </div>

      {/* Layer Selector Bar */}
      <div style={{ marginBottom: '1rem' }}>
        <MapLayerSelector activeLayer={activeLayer} onSelectLayer={onSelectLayer} t={t} />
      </div>

      {showAccessibleList ? (
        /* Accessible Table List View (Accessibility Requirement #19) */
        <div style={{ overflowX: 'auto', marginTop: '0.5rem' }}>
          <table 
            style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}
            aria-label="Accessible Weather Stations & Cities List"
          >
            <thead>
              <tr style={{ borderBottom: '1px solid var(--surface-border)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.65rem', textAlign: 'left' }}>{t('locationName', 'Location Name')}</th>
                <th style={{ padding: '0.65rem', textAlign: 'right' }}>{t('coordinates', 'Coordinates')}</th>
                <th style={{ padding: '0.65rem', textAlign: 'right' }}>{t('temperature', 'Temperature')}</th>
                <th style={{ padding: '0.65rem', textAlign: 'right' }}>{t('condition', 'Condition')}</th>
                <th style={{ padding: '0.65rem', textAlign: 'right' }}>{t('rainChance', 'Rain Chance')}</th>
                <th style={{ padding: '0.65rem', textAlign: 'right' }}>{t('aqi', 'AQI')}</th>
                <th style={{ padding: '0.65rem', textAlign: 'center' }}>{t('action', 'Action')}</th>
              </tr>
            </thead>
            <tbody>
              {nearbyStations.map((station) => {
                const isSelected = station.city.toLowerCase() === selectedCity.toLowerCase() || station.isCenter;
                return (
                  <tr 
                    key={station.id} 
                    style={{ 
                      borderBottom: '1px solid var(--surface-border)',
                      background: isSelected ? 'var(--accent-glow)' : 'transparent'
                    }}
                  >
                    <td style={{ padding: '0.65rem', fontWeight: 750, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <MapPin size={15} style={{ color: isSelected ? 'var(--accent-blue)' : 'var(--text-muted)' }} />
                      <span>{station.name}</span>
                      {isSelected && <span className="badge badge-info" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>{t('selected', 'Selected')}</span>}
                    </td>
                    <td style={{ padding: '0.65rem', textAlign: 'right', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                      {station.lat.toFixed(2)}°, {station.lon.toFixed(2)}°
                    </td>
                    <td style={{ padding: '0.65rem', textAlign: 'right', fontWeight: 750 }}>
                      {formatTemperature(station.temp, tempUnit)}
                    </td>
                    <td style={{ padding: '0.65rem', textAlign: 'right', color: 'var(--text-secondary)' }}>
                      {localizeCondition(station.condition, lang)}
                    </td>
                    <td style={{ padding: '0.65rem', textAlign: 'right', color: '#38bdf8', fontWeight: 600 }}>
                      {station.rainProbability}%
                    </td>
                    <td style={{ padding: '0.65rem', textAlign: 'right', color: station.aqi > 100 ? '#facc15' : '#10b981', fontWeight: 600 }}>
                      {station.aqi}
                    </td>
                    <td style={{ padding: '0.65rem', textAlign: 'center' }}>
                      <button
                        onClick={() => onSelectCity(station.name)}
                        className="btn-secondary"
                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', cursor: 'pointer' }}
                      >
                        {isSelected ? t('active', 'Active') : t('select', 'Select')}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* Real Leaflet OpenStreetMap Container Canvas */
        <div style={{ position: 'relative', width: '100%', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <MapContainer
            center={mapCenter}
            zoom={10}
            scrollWheelZoom={true}
            className="leaflet-weather-container"
          >
            {/* Smooth Camera Auto-Recenter Controller */}
            <MapRecenter center={mapCenter} zoom={10} />

            {/* Base Tile Layer dynamically selected by mapProvider */}
            {mapProvider === 'google_roadmap' && (
              <TileLayer
                key="google_roadmap"
                attribution='&copy; <a href="https://maps.google.com" target="_blank" rel="noreferrer">Google Maps</a>'
                url={`https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&key=${googleKey}`}
                subdomains={['0', '1', '2', '3']}
                maxZoom={20}
              />
            )}
            {mapProvider === 'google_satellite' && (
              <TileLayer
                key="google_satellite"
                attribution='&copy; <a href="https://maps.google.com" target="_blank" rel="noreferrer">Google Maps</a>'
                url={`https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}&key=${googleKey}`}
                subdomains={['0', '1', '2', '3']}
                maxZoom={20}
              />
            )}
            {mapProvider === 'google_terrain' && (
              <TileLayer
                key="google_terrain"
                attribution='&copy; <a href="https://maps.google.com" target="_blank" rel="noreferrer">Google Maps</a>'
                url={`https://mt{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}&key=${googleKey}`}
                subdomains={['0', '1', '2', '3']}
                maxZoom={20}
              />
            )}
            {mapProvider === 'osm' && (
              <TileLayer
                key="osm"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                maxZoom={19}
              />
            )}

            {/* Selected Primary Location Leaflet Marker */}
            <Marker
              position={mapCenter}
              icon={createMarkerIcon(resolvedCoords.name, centerWeatherData, true)}
              evented={true}
            >
              <Popup>
                <div style={{ padding: '0.4rem', color: 'var(--text-primary)', minWidth: '180px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.35rem' }}>
                    <MapPin size={15} style={{ color: 'var(--accent-blue)' }} />
                    <strong style={{ fontSize: '0.95rem' }}>{resolvedCoords.name}</strong>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                    {formatTemperature(centerWeatherData.temp, tempUnit)} • {localizeCondition(centerWeatherData.condition, lang)}
                  </p>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.35rem' }}>
                    <div>{t('rain', 'Rain')}: <span style={{ color: '#38bdf8' }}>{centerWeatherData.rainProbability}%</span></div>
                    <div>{t('wind', 'Wind')}: <span>{formatWind(centerWeatherData.windSpeed, windUnit)}</span></div>
                    <div>{t('humidity', 'Humidity')}: <span>{centerWeatherData.humidity}%</span></div>
                    <div>{t('aqi', 'AQI')}: <span style={{ color: '#10b981' }}>{centerWeatherData.aqi || 80}</span></div>
                  </div>
                </div>
              </Popup>
            </Marker>

            {/* Nearby Regional Weather Stations Markers */}
            {nearbyStations.filter(s => !s.isCenter).map((station) => {
              const isSelected = station.city.toLowerCase() === selectedCity.toLowerCase();
              return (
                <Marker
                  key={station.id}
                  position={[station.lat, station.lon]}
                  icon={createMarkerIcon(station.name, station, isSelected)}
                  eventHandlers={{
                    click: () => {
                      onSelectCity(station.name);
                    }
                  }}
                >
                  <Popup>
                    <div style={{ padding: '0.4rem', color: 'var(--text-primary)', minWidth: '160px' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.25rem' }}>{station.name}</div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                        {formatTemperature(station.temp, tempUnit)} • {localizeCondition(station.condition, lang)}
                      </div>
                      <button
                        onClick={() => onSelectCity(station.name)}
                        className="btn-primary"
                        style={{ marginTop: '0.5rem', width: '100%', padding: '0.3rem', fontSize: '0.75rem', cursor: 'pointer' }}
                      >
                        {t('setAsDashboardLocation', 'Set as Dashboard Location')}
                      </button>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>

          {/* Floating Live Telemetry Overlay Card */}
          <div style={{
            position: 'absolute',
            bottom: '14px',
            left: '14px',
            zIndex: 400,
            background: 'rgba(11, 15, 25, 0.88)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '0.65rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)'
          }}>
            <div style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: 'var(--accent-blue)',
              boxShadow: '0 0 10px var(--accent-blue)'
            }} />
            <div style={{ fontSize: '0.82rem', color: '#f8fafc' }}>
              <strong>{t('mapFocus', 'Map Focus')}:</strong> {resolvedCoords.name} {resolvedCoords.country ? `(${resolvedCoords.country})` : ''}
              <span style={{ color: '#38bdf8', marginLeft: '0.4rem', fontSize: '0.75rem', fontFamily: 'monospace' }}>
                [{resolvedCoords.lat.toFixed(4)}°N, {resolvedCoords.lon.toFixed(4)}°E]
              </span>
              <span style={{ color: 'var(--text-secondary)', marginLeft: '0.5rem' }}>
                {formatTemperature(centerWeatherData.temp, tempUnit)} • {localizeCondition(centerWeatherData.condition, lang)} • {t('humidity', 'Humidity')} {centerWeatherData.humidity}% • {t('aqi', 'AQI')} {centerWeatherData.aqi || 85}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Nearby Quick Station Chips (Requirement #11 & #18) */}
      <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--surface-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 750, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            {t('nearbyStationsTelemetry', 'Nearby Regional Stations & Telemetry')} ({nearbyStations.length})
          </span>
          {loadingNearby && (
            <span style={{ fontSize: '0.72rem', color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <RefreshCw size={10} className="animate-spin" /> {t('updatingFeeds', 'Updating station feeds...')}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
          {nearbyStations.map((st) => {
            const isSelected = st.city.toLowerCase() === selectedCity.toLowerCase() || (st.isCenter && selectedCity.toLowerCase() === cityMock.city.toLowerCase());
            return (
              <button
                key={st.id}
                onClick={() => onSelectCity(st.name)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.78rem',
                  fontWeight: isSelected ? 750 : 500,
                  background: isSelected ? 'var(--accent-glow)' : 'var(--surface-color)',
                  border: isSelected ? '1px solid var(--accent-blue)' : '1px solid var(--surface-border)',
                  color: isSelected ? 'var(--accent-blue)' : 'var(--text-primary)',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <MapPin size={12} style={{ color: isSelected ? 'var(--accent-blue)' : 'var(--text-muted)' }} />
                <span>{st.name}</span>
                <span style={{ fontWeight: 700 }}>{formatTemperature(st.temp, tempUnit)}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

