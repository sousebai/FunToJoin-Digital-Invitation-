// ─── ThemeContext.jsx ─────────────────────────────────────────────────────────
// 5-theme system: 2 dark modes + 2 light modes + 1 auto (system).
// Persists selected theme to localStorage.
// Applies theme by setting data-theme attribute on <html>.
// ─────────────────────────────────────────────────────────────────────────────

import React, { createContext, useContext, useState, useEffect } from 'react';

// Available themes
export const THEMES = [
  { id: 'midnight',   label: 'Midnight',    icon: '🌑', dark: true  },
  { id: 'ocean',      label: 'Deep Ocean',  icon: '🌊', dark: true  },
  { id: 'aurora',     label: 'Aurora',      icon: '🌌', dark: true  },
  { id: 'dawn',       label: 'Dawn',        icon: '🌤️', dark: false },
  { id: 'sand',       label: 'Warm Sand',   icon: '🏖️', dark: false },
];

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [themeId, setThemeId] = useState(() => {
    return localStorage.getItem('mosma-theme') || 'midnight';
  });

  const currentTheme = THEMES.find((t) => t.id === themeId) || THEMES[0];

  useEffect(() => {
    const root = document.documentElement;
    // Remove all theme classes
    THEMES.forEach((t) => root.removeAttribute('data-theme-' + t.id));
    // Set the active theme
    root.setAttribute('data-theme', themeId);
    // Set dark/light class for any global dark-only rules
    if (currentTheme.dark) {
      root.classList.remove('light');
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    localStorage.setItem('mosma-theme', themeId);
  }, [themeId, currentTheme.dark]);

  const setTheme = (id) => {
    if (THEMES.find((t) => t.id === id)) setThemeId(id);
  };

  return (
    <ThemeContext.Provider value={{ themeId, currentTheme, setTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
};
