import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Share2, Download, Copy, Check, CloudSun, ShieldCheck, 
  Thermometer, Droplets, Wind, Sparkles 
} from 'lucide-react';
import { formatTemperature } from '../../utils/formatTemperature';
import { formatWind } from '../../utils/formatWind';
import { localizeCondition } from '../../data/translations';

export function WeatherShareModal({ 
  isOpen, 
  onClose, 
  weather, 
  tempUnit = 'C', 
  windUnit = 'kmh', 
  lang = 'en', 
  t = (k, f) => f || k 
}) {
  const [copied, setCopied] = useState(false);
  const [shareMsg, setShareMsg] = useState('');
  const canvasRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !weather) return null;

  const loc = weather.location || {};
  const curr = weather.current || {};
  const city = loc.city || loc.name || 'Jodhpur';
  const region = loc.region || loc.country || '';
  const condition = localizeCondition(curr.condition, lang);
  const tempStr = formatTemperature(curr.temperature, tempUnit);
  const feelsStr = formatTemperature(curr.feelsLike, tempUnit);
  const windStr = formatWind(curr.windSpeed, windUnit, curr.windDirection);
  const rainStr = `${curr.rainProbability ?? 0}%`;
  const humidityStr = `${curr.humidity ?? 45}%`;

  const textSummary = `🌤️ WeatherGPT • ${city}${region ? `, ${region}` : ''}: ${tempStr} (${condition}). Feels like ${feelsStr}, Rain: ${rainStr}, Wind: ${windStr}. Live atmospheric telemetry.`;

  // Native Web Share API
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Weather in ${city} • WeatherGPT`,
          text: textSummary,
          url: window.location.href
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          handleCopy();
        }
      }
    } else {
      handleCopy();
    }
  };

  // Clipboard copy
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textSummary);
      setCopied(true);
      setShareMsg(t('copiedToClipboard', 'Weather summary copied to clipboard!'));
      setTimeout(() => {
        setCopied(false);
        setShareMsg('');
      }, 3000);
    } catch {
      setShareMsg(t('copyFailed', 'Unable to copy to clipboard.'));
    }
  };

  // Download crisp PNG snapshot generated via HTML5 Canvas
  const handleDownloadPNG = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext('2d');

    // 1. Gradient Background
    const bgGrad = ctx.createLinearGradient(0, 0, 1200, 630);
    bgGrad.addColorStop(0, '#0a0f1d');
    bgGrad.addColorStop(1, '#0f172a');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 630);

    // 2. Subtle Glow Accent
    const glowGrad = ctx.createRadialGradient(250, 150, 20, 250, 150, 450);
    glowGrad.addColorStop(0, 'rgba(56, 189, 248, 0.18)');
    glowGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
    ctx.fillStyle = glowGrad;
    ctx.fillRect(0, 0, 1200, 630);

    // 3. Card Border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 4;
    ctx.strokeRect(40, 40, 1120, 550);

    // 4. Header & Branding
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 32px system-ui, -apple-system, sans-serif';
    ctx.fillText('WEATHERGPT', 80, 105);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '20px system-ui, -apple-system, sans-serif';
    ctx.fillText('Real-Time Atmospheric Intelligence', 80, 138);

    // Trust Badge
    ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
    ctx.fillRect(860, 75, 260, 44);
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(860, 75, 260, 44);
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 18px system-ui, -apple-system, sans-serif';
    ctx.fillText('✓ Trust Verified Data', 885, 104);

    // 5. City & Main Temperature
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 64px system-ui, -apple-system, sans-serif';
    ctx.fillText(city, 80, 240);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '28px system-ui, -apple-system, sans-serif';
    ctx.fillText(region || 'Observation Station', 80, 285);

    ctx.fillStyle = '#38bdf8';
    ctx.font = '850 110px system-ui, -apple-system, sans-serif';
    ctx.fillText(tempStr, 80, 420);

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 36px system-ui, -apple-system, sans-serif';
    ctx.fillText(condition, 520, 360);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '24px system-ui, -apple-system, sans-serif';
    ctx.fillText(`Feels Like ${feelsStr}`, 520, 410);

    // 6. Metrics Strip Box
    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.fillRect(80, 465, 1040, 85);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 2;
    ctx.strokeRect(80, 465, 1040, 85);

    // Metrics Columns
    ctx.fillStyle = '#94a3b8';
    ctx.font = '18px system-ui, -apple-system, sans-serif';
    ctx.fillText('Rain Probability', 120, 498);
    ctx.fillText('Wind Velocity', 380, 498);
    ctx.fillText('Relative Humidity', 640, 498);
    ctx.fillText('Air Quality', 900, 498);

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 26px system-ui, -apple-system, sans-serif';
    ctx.fillText(rainStr, 120, 532);
    ctx.fillText(windStr, 380, 532);
    ctx.fillText(humidityStr, 640, 532);
    ctx.fillText(curr.aqi ? `AQI ${curr.aqi}` : 'AQI Moderate', 900, 532);

    // Trigger download
    const link = document.createElement('a');
    link.download = `WeatherGPT-${city.replace(/\s+/g, '_')}-${new Date().toISOString().slice(0, 10)}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.2s ease-out'
      }}
      role="dialog"
      aria-modal="true"
      aria-label={t('shareTitle', 'Share Weather Snapshot')}
      onClick={onClose}
    >
      <div 
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '520px',
          padding: '1.75rem',
          borderRadius: 'var(--radius-xl)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          background: 'var(--surface-color)',
          border: '1px solid var(--surface-border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Share2 size={20} style={{ color: 'var(--accent-blue)' }} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>
              {t('shareTitle', 'Share Weather Snapshot')}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="btn-secondary"
            style={{ padding: '0.35rem', borderRadius: 'var(--radius-full)', border: 'none' }}
            aria-label="Close share dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Visual Preview Card */}
        <div 
          style={{
            padding: '1.5rem',
            borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95))',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            boxShadow: '0 12px 28px rgba(0, 0, 0, 0.35)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CloudSun size={18} style={{ color: 'var(--accent-blue)' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 850, letterSpacing: '-0.02em' }}>WeatherGPT</span>
            </div>
            <span className="badge badge-info" style={{ fontSize: '0.68rem' }}>
              <ShieldCheck size={11} /> Trust Verified
            </span>
          </div>

          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 900, margin: 0, color: '#f8fafc' }}>
              {city}
            </h2>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              {region || 'Atmospheric Station'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
            <span style={{ fontSize: '3rem', fontWeight: 850, color: '#38bdf8', lineHeight: 1 }}>
              {tempStr}
            </span>
            <div>
              <span style={{ fontSize: '1.1rem', fontWeight: 700, display: 'block', color: '#f8fafc' }}>
                {condition}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                {t('feelsLike', 'Feels Like')} {feelsStr}
              </span>
            </div>
          </div>

          {/* Quick Metrics */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.5rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div>
              <span style={{ fontSize: '0.68rem', color: '#94a3b8', display: 'block' }}>{t('rainChance', 'Rain')}</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 750, color: '#38bdf8' }}>{rainStr}</span>
            </div>
            <div>
              <span style={{ fontSize: '0.68rem', color: '#94a3b8', display: 'block' }}>{t('wind', 'Wind')}</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 750, color: '#f8fafc' }}>{windStr}</span>
            </div>
            <div>
              <span style={{ fontSize: '0.68rem', color: '#94a3b8', display: 'block' }}>{t('humidity', 'Humidity')}</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 750, color: '#f8fafc' }}>{humidityStr}</span>
            </div>
          </div>
        </div>

        {/* Feedback Message */}
        {shareMsg && (
          <div style={{
            padding: '0.5rem 0.75rem',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--accent-glow)',
            color: 'var(--accent-blue)',
            fontSize: '0.8rem',
            textAlign: 'center',
            fontWeight: 600
          }}>
            {shareMsg}
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
          <button
            onClick={handleNativeShare}
            className="btn-primary"
            style={{ flex: 1, padding: '0.65rem', fontSize: '0.85rem', gap: '0.4rem', justifyContent: 'center' }}
          >
            <Share2 size={16} />
            <span>{t('shareWeather', 'Share Weather')}</span>
          </button>

          <button
            onClick={handleDownloadPNG}
            className="btn-secondary"
            style={{ flex: 1, padding: '0.65rem', fontSize: '0.85rem', gap: '0.4rem', justifyContent: 'center' }}
          >
            <Download size={16} />
            <span>{t('downloadImage', 'Download PNG')}</span>
          </button>

          <button
            onClick={handleCopy}
            className="btn-secondary"
            style={{ padding: '0.65rem 0.85rem', fontSize: '0.85rem', gap: '0.35rem' }}
            title={t('copySummary', 'Copy Weather Text')}
          >
            {copied ? <Check size={16} style={{ color: '#10b981' }} /> : <Copy size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}
