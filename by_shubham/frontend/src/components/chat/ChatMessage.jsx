import React, { useState } from 'react';
import { 
  Sparkles, User, Info, MapPin, Thermometer, Umbrella, Wind, Droplets, 
  Volume2, VolumeX, ShieldCheck, CheckCircle2, AlertTriangle, Compass,
  ChevronDown, ChevronRight
} from 'lucide-react';
import { ChatIntentCard } from './ChatIntentCard';

function renderBoldText(str) {
  if (!str) return '';
  const parts = str.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

function renderFormattedMessageText(text, isUser) {
  if (!text) return null;
  if (isUser) {
    return <p style={{ margin: 0, flex: 1, whiteSpace: 'pre-wrap' }}>{text}</p>;
  }

  const lines = text.split('\n');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1 }}>
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} style={{ height: '0.2rem' }} />;
        }
        
        // Header line (### or ##)
        if (trimmed.startsWith('### ') || trimmed.startsWith('## ')) {
          const hText = trimmed.replace(/^#+\s*/, '');
          return (
            <div key={idx} style={{ fontWeight: 800, fontSize: '0.98rem', color: 'var(--text-primary)', marginTop: '0.3rem', marginBottom: '0.15rem' }}>
              {renderBoldText(hText)}
            </div>
          );
        }

        // Bullet point
        if (trimmed.startsWith('•') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const bulletText = trimmed.replace(/^[•\-\*]\s*/, '');
          return (
            <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem', paddingLeft: '0.35rem', lineHeight: 1.5 }}>
              <span style={{ color: 'var(--accent-blue)', fontWeight: 800 }}>•</span>
              <span style={{ flex: 1 }}>{renderBoldText(bulletText)}</span>
            </div>
          );
        }

        // Normal paragraph
        return (
          <div key={idx} style={{ lineHeight: 1.5 }}>
            {renderBoldText(line)}
          </div>
        );
      })}
    </div>
  );
}

export function ChatMessage({ message, t = (k, f) => f || k }) {
  const isUser = message.sender === 'user';
  const { text, timestamp, richContent, understanding } = message;
  const [isPlaying, setIsPlaying] = useState(false);
  const [sourcesOpen, setSourcesOpen] = useState(false);

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) {
      alert("Speech synthesis is not supported in this browser.");
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: isUser ? 'flex-end' : 'flex-start',
      margin: '0.75rem 0',
      width: '100%'
    }}>
      {/* Sender & Timestamp */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        fontSize: '0.72rem',
        color: 'var(--text-muted)',
        marginBottom: '0.25rem'
      }}>
        {isUser ? (
          <>
            <span>{t('you', 'You')}</span>
            <User size={12} />
          </>
        ) : (
          <>
            <Sparkles size={12} style={{ color: 'var(--accent-blue)' }} />
            <span>WeatherGPT AI</span>
          </>
        )}
        <span>• {timestamp}</span>
      </div>

      {/* Query Understanding Card if extracted (A11) */}
      {!isUser && understanding && (
        <div style={{ width: '100%', maxWidth: '85%' }}>
          <ChatIntentCard understanding={understanding} t={t} />
        </div>
      )}

      {/* Main Message Bubble */}
      <div style={{
        maxWidth: '85%',
        padding: '0.85rem 1.15rem',
        borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
        background: isUser 
          ? 'linear-gradient(135deg, var(--accent-blue), var(--accent-indigo))' 
          : 'var(--surface-card)',
        color: isUser ? '#ffffff' : 'var(--text-primary)',
        border: isUser ? 'none' : '1px solid var(--surface-border)',
        boxShadow: 'var(--shadow-sm)',
        lineHeight: 1.5,
        fontSize: '0.92rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', width: '100%' }}>
          {renderFormattedMessageText(text, isUser)}
          {!isUser && 'speechSynthesis' in window && (
            <button
              onClick={handleSpeak}
              title={isPlaying ? "Stop reading" : "Read aloud"}
              aria-label={isPlaying ? "Stop speech playback" : "Read response aloud"}
              style={{
                background: 'transparent',
                border: 'none',
                color: isPlaying ? 'var(--accent-blue)' : 'var(--text-muted)',
                cursor: 'pointer',
                padding: '0.2rem',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {isPlaying ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
          )}
        </div>

        {/* Embedded Rich Weather Response Card */}
        {richContent && (
          <div style={{
            marginTop: '0.85rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--surface-border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.65rem',
            fontSize: '0.82rem'
          }}>
            {/* Multi-City or Single-City Metric Cards */}
            {richContent.multiCityReports && richContent.multiCityReports.length > 1 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '0.65rem' }}>
                {richContent.multiCityReports.map((report, idx) => (
                  <div key={idx} style={{ 
                    padding: '0.65rem 0.85rem', 
                    background: 'var(--surface-color)', 
                    border: '1px solid var(--surface-border)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.3rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 750, color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <MapPin size={13} /> {report.city}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{report.condition}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>{report.temp}</span>
                      {report.highLow && (
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{report.highLow}</span>
                      )}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        <Umbrella size={11} /> {report.rainProbability}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        <Wind size={11} /> {report.wind}
                      </span>
                      {report.humidity && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                          <Droplets size={11} /> {report.humidity}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Metric Chips Row */
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', fontWeight: 600 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--accent-blue)', background: 'var(--accent-glow)', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)' }}>
                  <MapPin size={13} /> {richContent.city}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'var(--surface-color)', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)' }}>
                  <Thermometer size={13} /> {richContent.temp}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'var(--surface-color)', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)' }}>
                  <Umbrella size={13} /> {richContent.rainProbability}
                </span>
                {richContent.wind && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'var(--surface-color)', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)' }}>
                    <Wind size={13} /> {richContent.wind}
                  </span>
                )}
                {richContent.contextLabel && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--accent-indigo)', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)' }}>
                    <Compass size={13} /> {richContent.contextLabel}
                  </span>
                )}
              </div>
            )}

            {/* STRICT SEPARATION: Official Warning vs AI Guidance */}
            {richContent.officialWarning && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                borderLeft: '3px solid #ef4444',
                padding: '0.55rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                color: '#ef4444',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.4rem'
              }}>
                <AlertTriangle size={15} style={{ flexShrink: 0, marginTop: '0.1rem' }} />
                <div>
                  <strong style={{ display: 'block', marginBottom: '0.15rem' }}>
                    {t('officialWarning', 'Official Warning / Advisory')}
                  </strong>
                  <span>{richContent.officialWarning}</span>
                </div>
              </div>
            )}

            {/* Collapsible Sources Used Dropdown */}
            {richContent.sourcesUsed && richContent.sourcesUsed.length > 0 && (
              <div style={{
                background: 'var(--surface-color)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--surface-border)',
                overflow: 'hidden',
                marginTop: '0.25rem'
              }}>
                <button
                  type="button"
                  onClick={() => setSourcesOpen(prev => !prev)}
                  aria-expanded={sourcesOpen}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.4rem 0.65rem',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    fontSize: '0.74rem',
                    fontWeight: 650,
                    cursor: 'pointer'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <CheckCircle2 size={13} style={{ color: '#10b981' }} />
                    <span>{t('sourcesUsed', 'Sources Used')} ({richContent.sourcesUsed.length})</span>
                  </span>
                  {sourcesOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </button>
                {sourcesOpen && (
                  <div style={{
                    padding: '0.45rem 0.65rem 0.55rem 0.65rem',
                    borderTop: '1px solid var(--surface-border)',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.65rem',
                    fontSize: '0.72rem',
                    color: 'var(--text-muted)'
                  }}>
                    {richContent.sourcesUsed.map((s, idx) => (
                      <span key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#10b981' }}>
                        <CheckCircle2 size={11} /> {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Disclaimer & AI attribution */}
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Info size={11} />
              <span>{richContent.aiExplanationLabel || "WeatherGPT AI Synthesis"}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
