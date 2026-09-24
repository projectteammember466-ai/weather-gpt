import React from 'react';
import { Thermometer, CloudRain, Wind, Cloud, ShieldAlert, Activity } from 'lucide-react';

export function MapLayerSelector({ activeLayer, onSelectLayer, t = (k, f) => f || k }) {
  const layers = [
    { id: 'temperature', label: t('layerTemperature', 'Temperature'), icon: Thermometer, color: '#f97316' },
    { id: 'rain', label: t('layerRain', 'Rain'), icon: CloudRain, color: '#38bdf8' },
    { id: 'wind', label: t('layerWind', 'Wind'), icon: Wind, color: '#06b6d4' },
    { id: 'clouds', label: t('layerClouds', 'Clouds'), icon: Cloud, color: '#cbd5e1' },
    { id: 'alerts', label: t('layerAlerts', 'Alerts'), icon: ShieldAlert, color: '#ef4444' },
    { id: 'aqi', label: t('layerAQI', 'AQI'), icon: Activity, color: '#10b981' }
  ];

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.4rem',
      flexWrap: 'wrap',
      padding: '0.5rem',
      background: 'var(--surface-color)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--surface-border)'
    }}>
      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginRight: '0.25rem' }}>
        {t('layers', 'Layers')}:
      </span>
      {layers.map((layer) => {
        const Icon = layer.icon;
        const isSelected = activeLayer === layer.id;
        return (
          <button
            key={layer.id}
            onClick={() => onSelectLayer(layer.id)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.35rem 0.65rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.78rem',
              fontWeight: isSelected ? 800 : 500,
              background: isSelected ? 'var(--accent-glow)' : 'transparent',
              color: isSelected ? 'var(--accent-blue)' : 'var(--text-secondary)',
              border: isSelected ? '1px solid var(--accent-blue)' : '1px solid transparent',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
          >
            <Icon size={14} style={{ color: isSelected ? 'var(--accent-blue)' : layer.color }} />
            <span>{layer.label}</span>
          </button>
        );
      })}
    </div>
  );
}
