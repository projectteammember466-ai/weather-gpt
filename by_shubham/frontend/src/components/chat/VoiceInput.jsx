import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';

export function VoiceInput({ onTranscript, disabled }) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [recognition, setRecognition] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const reco = new SpeechRecognition();
    reco.continuous = false;
    reco.interimResults = false;
    reco.lang = 'en-US';

    reco.onstart = () => {
      setIsListening(true);
      setErrorMsg('');
    };

    reco.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (onTranscript && transcript) {
        onTranscript(transcript);
      }
      setIsListening(false);
    };

    reco.onerror = (event) => {
      console.warn("Speech recognition error:", event.error);
      setIsListening(false);
      if (event.error === 'not-allowed') {
        setErrorMsg('Microphone permission denied.');
      } else {
        setErrorMsg('Speech recognition error. Please try text input.');
      }
    };

    reco.onend = () => {
      setIsListening(false);
    };

    setRecognition(reco);
  }, [onTranscript]);

  const toggleListening = () => {
    if (!isSupported) {
      alert("Voice input is not available in this browser. You can continue using text.");
      return;
    }

    if (isListening) {
      recognition?.stop();
    } else {
      try {
        recognition?.start();
      } catch (err) {
        console.error("Speech start error:", err);
      }
    }
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        onClick={toggleListening}
        disabled={disabled}
        title={!isSupported ? "Voice input unavailable" : isListening ? "Listening... Click to stop" : "Voice input"}
        style={{
          padding: '0.625rem',
          borderRadius: 'var(--radius-md)',
          background: isListening ? 'rgba(239, 68, 68, 0.2)' : 'var(--surface-card)',
          border: isListening ? '1px solid #ef4444' : '1px solid var(--surface-border)',
          color: isListening ? '#ef4444' : isSupported ? 'var(--accent-blue)' : 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: disabled ? 'not-allowed' : 'pointer'
        }}
      >
        {isListening ? (
          <Loader2 size={18} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
        ) : !isSupported ? (
          <MicOff size={18} />
        ) : (
          <Mic size={18} />
        )}
      </button>

      {errorMsg && (
        <span style={{
          position: 'absolute',
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginBottom: '6px',
          background: '#ef4444',
          color: '#fff',
          fontSize: '0.7rem',
          padding: '0.2rem 0.5rem',
          borderRadius: 'var(--radius-sm)',
          whiteSpace: 'nowrap'
        }}>
          {errorMsg}
        </span>
      )}
    </div>
  );
}
