// Theme Custom Hook (System / Light / Dark)

import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

export function useTheme() {
  const [theme, setTheme] = useLocalStorage('weathergpt_theme', 'system');

  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = (themeValue) => {
      let resolvedTheme = themeValue;

      if (themeValue === 'system') {
        resolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';
      }

      root.setAttribute('data-theme', resolvedTheme);
    };

    applyTheme(theme);

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme('system');
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  return [theme, setTheme];
}
