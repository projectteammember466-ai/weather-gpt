import React from 'react';
import { Sparkles } from 'lucide-react';
import { getContextSuggestedQuestions } from '../../data/contextModes';
import { INITIAL_SUGGESTED_QUESTIONS, WEATHER_AWARE_QUESTIONS } from '../../data/chatData';

export function SuggestedQuestions({ 
  onSelectQuestion, 
  weatherAware = false, 
  userMode = 'general', 
  lang = 'en', 
  t = (k, f) => f || k 
}) {
  const contextQuestions = getContextSuggestedQuestions(userMode, lang);
  const questions = (contextQuestions && contextQuestions.length > 0)
    ? contextQuestions
    : (weatherAware ? WEATHER_AWARE_QUESTIONS : INITIAL_SUGGESTED_QUESTIONS);

  return (
    <div style={{ margin: '0.75rem 0' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.35rem',
        fontSize: '0.75rem',
        fontWeight: 700,
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        marginBottom: '0.5rem'
      }}>
        <Sparkles size={12} style={{ color: 'var(--accent-blue)' }} /> {t('suggestedQuestions', 'Suggested Questions')}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
        {questions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => onSelectQuestion(q)}
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              background: 'var(--surface-color)',
              border: '1px solid var(--surface-border)',
              fontSize: '0.8rem',
              color: 'var(--text-secondary)',
              transition: 'all var(--transition-fast)',
              cursor: 'pointer'
            }}
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
