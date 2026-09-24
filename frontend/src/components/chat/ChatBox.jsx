import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Sparkles, Loader2, RefreshCw, AlertCircle, RotateCw, Globe, Compass, Check,
  ChevronDown, User, Sprout, Plane, Sun, AlertTriangle, Car, CalendarCheck, Activity, Info 
} from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { SuggestedQuestions } from './SuggestedQuestions';
import { VoiceInput } from './VoiceInput';
import { postChatMessage } from '../../services/api';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useSavedLocations } from '../../hooks/useSavedLocations';
import { extractQueryUnderstanding } from '../../data/chatData';
import { SUPPORTED_LANGUAGES } from '../../data/translations';
import { CONTEXT_MODES, getContextMode } from '../../data/contextModes';

// Icon mapping for 8 perspective modes
const MODE_ICONS = {
  general: User,
  farmer: Sprout,
  traveler: Plane,
  outdoor: Sun,
  emergency: AlertTriangle,
  commuter: Car,
  event_planner: CalendarCheck,
  fitness: Activity
};

export function ChatBox({ 
  weatherData, 
  initialMessage, 
  lang = 'en', 
  setLang, 
  userMode = 'general',
  setUserMode,
  t = (k, f) => f || k 
}) {
  const currentModeObj = getContextMode(userMode);
  const currentModeName = currentModeObj.names[lang] || currentModeObj.names.en;
  const { savedLocations } = useSavedLocations();

  const [messages, setMessages] = useLocalStorage('weathergpt_chat_history', [
    {
      id: 'msg-welcome',
      sender: 'assistant',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: lang === 'hi'
        ? `नमस्ते! मैं WeatherGPT हूँ, आपका AI मौसम सहायक। मुझसे ${weatherData?.location?.city || 'जोधपुर'} या दुनिया के किसी भी शहर के मौसम के बारे में पूछें।`
        : lang === 'hinglish'
        ? `Hello! Main WeatherGPT hoon, aapka AI Weather Assistant. ${weatherData?.location?.city || 'Jodhpur'} ya kisi bhi city ke mausam ke baare mein poochhein!`
        : `Hello! I'm WeatherGPT, your AI Weather Assistant. Ask me anything about the weather in ${weatherData?.location?.city || 'Jodhpur'} or any city worldwide!`,
      richContent: {
        city: weatherData?.location?.city || 'Jodhpur',
        temp: `${weatherData?.current?.temperature || 30}°C`,
        condition: weatherData?.current?.condition || 'Sunny',
        rainProbability: `${weatherData?.current?.rainProbability || 10}%`,
        contextLabel: currentModeName,
        tip: lang === 'hi' 
          ? "पूछें 'क्या आज बारिश होगी?' या 'जोधपुर का तापमान क्या है?'" 
          : lang === 'hinglish' 
          ? "Poochhein 'Kal Jodhpur mein baarish hogi?' ya 'What's the temperature today?'" 
          : "Ask me 'Will it rain today?' or 'What's the temperature in Jodhpur?'",
        sourcesUsed: ["Current Telemetry", "Deterministic Forecast Grid"],
        aiExplanationLabel: "WeatherGPT AI Synthesis"
      }
    }
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [priorContext, setPriorContext] = useState({
    location: weatherData?.location?.city || 'Jodhpur',
    time: 'Today',
    intent: 'CURRENT_WEATHER',
    userMode: userMode
  });
  const [lastFailedQuery, setLastFailedQuery] = useState(null);
  const [error, setError] = useState('');
  const [perspectiveOpen, setPerspectiveOpen] = useState(false);
  const perspectiveRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Close perspective dropdown on outside click or Escape
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (perspectiveRef.current && !perspectiveRef.current.contains(e.target)) {
        setPerspectiveOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setPerspectiveOpen(false);
      }
    };

    if (perspectiveOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [perspectiveOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (weatherData?.location?.city) {
      setPriorContext(prev => ({
        ...prev,
        location: weatherData.location.city
      }));
    }
  }, [weatherData?.location?.city]);

  useEffect(() => {
    if (initialMessage) {
      handleSendMessage(initialMessage);
    }
  }, [initialMessage]);

  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    setError('');
    setLastFailedQuery(null);

    // Extract understanding for user message tracking
    const understanding = extractQueryUnderstanding(query, priorContext);
    const updatedContext = {
      location: understanding.location || priorContext.location,
      time: understanding.time || priorContext.time,
      intent: understanding.intent || priorContext.intent,
      userMode: userMode,
      savedLocations: savedLocations
    };
    setPriorContext(updatedContext);

    const userMsg = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: query
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    try {
      if (query.toLowerCase() === 'error' || query.toLowerCase() === 'fail') {
        throw new Error(t('errorGeneric', 'Simulated AI service timeout. Please try again.'));
      }
      const response = await postChatMessage(query, weatherData, lang, updatedContext);
      setMessages((prev) => [...prev, response]);
    } catch (err) {
      console.error("Chat error:", err);
      setError(err.message || t('errorGeneric', 'Failed to generate AI weather response. Please try again.'));
      setLastFailedQuery(query);
    } finally {
      setIsTyping(false);
    }
  };

  const handleRetryLast = () => {
    if (lastFailedQuery) {
      handleSendMessage(lastFailedQuery);
    }
  };

  const handleVoiceTranscript = (transcript) => {
    setInput(transcript); // Speech text fills input for verification; does NOT auto-submit (A21)
  };

  const handleClearChat = () => {
    setMessages([]);
    setError('');
    setLastFailedQuery(null);
    setPriorContext({
      location: weatherData?.location?.city || 'Jodhpur',
      time: 'Today',
      intent: 'CURRENT_WEATHER',
      userMode: userMode
    });
  };

  return (
    <div className="glass-card" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      maxHeight: '100%',
      padding: '1.25rem',
      width: '100%',
      boxSizing: 'border-box',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: '0.75rem',
        borderBottom: '1px solid var(--surface-border)',
        marginBottom: '1rem',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            padding: '0.45rem',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--accent-glow)',
            color: 'var(--accent-blue)',
            display: 'flex',
            alignItems: 'center'
          }}>
            <Sparkles size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{t('weatherGPTAI', 'WeatherGPT AI')}</h2>
              <span className="badge badge-info" style={{ fontSize: '0.62rem', padding: '0.1rem 0.35rem' }}>
                {t('aiAssistant', 'AI Assistant')}
              </span>
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              {t('location', 'Location')}: {weatherData?.location?.city || 'Global'} • {t('perspective', 'Perspective')}: <strong style={{ color: 'var(--accent-blue)' }}>{currentModeName}</strong>
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {/* Weather Perspective Dropdown */}
          <div ref={perspectiveRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setPerspectiveOpen(!perspectiveOpen)}
              aria-expanded={perspectiveOpen}
              aria-haspopup="true"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                background: perspectiveOpen ? 'var(--accent-glow)' : 'var(--surface-color)',
                padding: '0.35rem 0.65rem',
                borderRadius: 'var(--radius-sm)',
                border: perspectiveOpen ? '1px solid var(--accent-blue)' : '1px solid var(--surface-border)',
                color: 'var(--text-primary)',
                fontSize: '0.78rem',
                fontWeight: 650,
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
              title={t('tailorAIAdvice', 'Tailor AI advice to your activity')}
            >
              <div style={{
                padding: '0.2rem',
                borderRadius: '4px',
                background: 'rgba(99, 102, 241, 0.15)',
                color: 'var(--accent-indigo)',
                display: 'flex',
                alignItems: 'center'
              }}>
                {React.createElement(MODE_ICONS[userMode] || User, { size: 13 })}
              </div>
              <span>{currentModeName}</span>
              <ChevronDown 
                size={13} 
                style={{ 
                  color: 'var(--text-muted)',
                  transform: perspectiveOpen ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.15s ease'
                }} 
              />
            </button>

            {/* Dropdown Menu */}
            {perspectiveOpen && (
              <div 
                className="glass-card page-fade-in"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 6px)',
                  right: 0,
                  width: '290px',
                  maxHeight: '380px',
                  overflowY: 'auto',
                  zIndex: 100,
                  padding: '0.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: '0 12px 32px rgba(0, 0, 0, 0.35)',
                  border: '1px solid var(--surface-border)',
                  background: 'var(--surface-card)'
                }}
              >
                <div style={{
                  padding: '0.35rem 0.5rem 0.45rem 0.5rem',
                  borderBottom: '1px solid var(--surface-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Compass size={14} style={{ color: 'var(--accent-blue)' }} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 750, color: 'var(--text-primary)' }}>
                      {t('weatherPerspective', 'Weather Perspective')}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                    8 {t('profiles', 'Profiles')}
                  </span>
                </div>

                {CONTEXT_MODES.map((mode) => {
                  const isSelected = userMode === mode.id;
                  const IconComp = MODE_ICONS[mode.id] || User;
                  const mName = mode.names[lang] || mode.names.en;
                  const mDesc = mode.descriptions[lang] || mode.descriptions.en;

                  return (
                    <button
                      key={mode.id}
                      onClick={() => {
                        if (setUserMode) setUserMode(mode.id);
                        setPerspectiveOpen(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.5rem',
                        padding: '0.45rem 0.55rem',
                        borderRadius: 'var(--radius-sm)',
                        background: isSelected ? 'var(--accent-glow)' : 'transparent',
                        border: isSelected ? '1px solid var(--accent-blue)' : '1px solid transparent',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all var(--transition-fast)'
                      }}
                    >
                      <div style={{
                        padding: '0.25rem',
                        borderRadius: '4px',
                        background: isSelected ? 'var(--accent-blue)' : 'var(--surface-color)',
                        color: isSelected ? '#fff' : 'var(--text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        flexShrink: 0,
                        marginTop: '0.1rem'
                      }}>
                        <IconComp size={13} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.25rem' }}>
                          <span style={{
                            fontSize: '0.78rem',
                            fontWeight: isSelected ? 750 : 600,
                            color: isSelected ? 'var(--accent-blue)' : 'var(--text-primary)'
                          }}>
                            {mName}
                          </span>
                          {isSelected && <Check size={13} style={{ color: 'var(--accent-blue)', flexShrink: 0 }} />}
                        </div>
                        <p style={{
                          fontSize: '0.66rem',
                          color: 'var(--text-muted)',
                          margin: '0.1rem 0 0 0',
                          lineHeight: 1.25,
                          whiteSpace: 'normal'
                        }}>
                          {mDesc}
                        </p>
                      </div>
                    </button>
                  );
                })}

                <div style={{
                  fontSize: '0.66rem',
                  color: 'var(--text-muted)',
                  background: 'var(--surface-color)',
                  padding: '0.45rem 0.6rem',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  marginTop: '0.2rem'
                }}>
                  <Info size={12} style={{ flexShrink: 0, color: 'var(--accent-blue)' }} />
                  <span>{t('modeSyncNote', 'Perspective syncs with Dashboard and Settings.')}</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Language Selector */}
          {setLang && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'var(--surface-color)', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--surface-border)' }}>
              <Globe size={13} style={{ color: 'var(--accent-blue)' }} />
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '0.75rem',
                  color: 'var(--text-primary)',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
                aria-label={t('selectLanguage', 'Select chat language')}
              >
                {SUPPORTED_LANGUAGES.map(l => (
                  <option key={l.id} value={l.id} style={{ background: 'var(--surface-card)', color: 'var(--text-primary)' }}>
                    {l.native}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={handleClearChat}
            style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              padding: '0.35rem 0.65rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--surface-border)',
              background: 'var(--surface-color)',
              cursor: 'pointer'
            }}
            title={t('clearChat', 'Clear Conversation History')}
          >
            <RefreshCw size={12} /> {t('clearChat', 'Clear Chat')}
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div 
        style={{
          flex: 1,
          overflowY: 'auto',
          paddingRight: '0.5rem',
          display: 'flex',
          flexDirection: 'column'
        }}
        role="log"
        aria-live="polite"
        aria-label="Conversation messages"
      >
        {messages.length === 0 ? (
          <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-muted)', padding: '2rem 1rem' }}>
            <Sparkles size={36} style={{ color: 'var(--accent-blue)', margin: '0 auto 0.75rem auto' }} />
            <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>{t('conversationCleared', 'Conversation is cleared.')}</p>
            <p style={{ fontSize: '0.82rem', maxWidth: '420px', margin: '0.35rem auto 0 auto' }}>
              {t('askSuggestionHint', 'Pick a suggested question below or ask in English, Hindi, or Hinglish.')}
            </p>
          </div>
        ) : (
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} t={t} />)
        )}

        {isTyping && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            margin: '0.5rem 0',
            color: 'var(--text-muted)',
            fontSize: '0.82rem',
            padding: '0.5rem 0.75rem',
            background: 'var(--surface-card)',
            borderRadius: 'var(--radius-md)',
            alignSelf: 'flex-start'
          }}>
            <Loader2 size={16} className="animate-spin" style={{ color: 'var(--accent-blue)', animation: 'spin 1s linear infinite' }} />
            <span>{t('analyzingPatterns', 'Analyzing contextual weather patterns...')}</span>
          </div>
        )}

        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem',
            color: '#ef4444',
            fontSize: '0.82rem',
            padding: '0.75rem 1rem',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--radius-md)',
            margin: '0.5rem 0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
            {lastFailedQuery && (
              <button
                onClick={handleRetryLast}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#ef4444',
                  background: 'rgba(239, 68, 68, 0.15)',
                  padding: '0.25rem 0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <RotateCw size={12} /> {t('retry', 'Retry')}
              </button>
            )}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Context-aware Suggested Questions */}
      <SuggestedQuestions 
        onSelectQuestion={(q) => handleSendMessage(q)} 
        weatherAware={true} 
        userMode={userMode}
        lang={lang}
        t={t}
      />

      {/* Input Composer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginTop: '0.75rem',
          paddingTop: '0.75rem',
          borderTop: '1px solid var(--surface-border)'
        }}
      >
        <VoiceInput onTranscript={handleVoiceTranscript} disabled={isTyping} />

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('typeQuestion', 'Ask WeatherGPT about rain, temperature, or recommendations...')}
          disabled={isTyping}
          aria-label={t('typeQuestion', 'Ask WeatherGPT message input')}
          style={{
            flex: 1,
            padding: '0.65rem 1rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--surface-color)',
            border: '1px solid var(--surface-border)',
            fontSize: '0.9rem',
            color: 'var(--text-primary)'
          }}
        />

        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          className="btn-primary"
          aria-label={t('send', 'Send')}
          style={{
            padding: '0.65rem 1.1rem',
            opacity: (!input.trim() || isTyping) ? 0.5 : 1,
            cursor: (!input.trim() || isTyping) ? 'not-allowed' : 'pointer'
          }}
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
