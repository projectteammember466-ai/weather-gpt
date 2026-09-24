// Custom Hook for Multilingual UI (A12)

import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { getTranslation, SUPPORTED_LANGUAGES } from '../data/translations';

export function useLanguage() {
  const [lang, setLang] = useLocalStorage('weathergpt_language', 'en');

  const t = useCallback((key, fallback) => {
    return getTranslation(lang, key, fallback);
  }, [lang]);

  return {
    lang,
    setLang,
    t,
    supportedLanguages: SUPPORTED_LANGUAGES
  };
}
