// ─── ThemePicker.jsx ─────────────────────────────────────────────────────────
// Floating theme picker panel triggered from the sidebar.
// Shows all 5 themes as clickable swatches with label + icon.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Palette } from 'lucide-react';

const ThemePicker = () => {
  const { themeId, setTheme, themes } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="theme-picker-wrapper" ref={ref}>
      {/* Trigger button */}
      <button
        className="theme-toggle-btn"
        onClick={() => setOpen((o) => !o)}
        title="Change theme"
        aria-label="Open theme picker"
      >
        <Palette size={18} />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="theme-picker-panel">
          <p className="theme-picker-label">Choose Theme</p>

          <div className="theme-picker-section-title">🌙 Dark</div>
          <div className="theme-picker-grid">
            {themes.filter((t) => t.dark).map((t) => (
              <button
                key={t.id}
                className={`theme-swatch theme-swatch-${t.id} ${themeId === t.id ? 'theme-swatch-active' : ''}`}
                onClick={() => { setTheme(t.id); setOpen(false); }}
                title={t.label}
              >
                <span className="swatch-icon">{t.icon}</span>
                <span className="swatch-label">{t.label}</span>
                {themeId === t.id && <span className="swatch-check">✓</span>}
              </button>
            ))}
          </div>

          <div className="theme-picker-section-title">☀️ Light</div>
          <div className="theme-picker-grid">
            {themes.filter((t) => !t.dark).map((t) => (
              <button
                key={t.id}
                className={`theme-swatch theme-swatch-${t.id} ${themeId === t.id ? 'theme-swatch-active' : ''}`}
                onClick={() => { setTheme(t.id); setOpen(false); }}
                title={t.label}
              >
                <span className="swatch-icon">{t.icon}</span>
                <span className="swatch-label">{t.label}</span>
                {themeId === t.id && <span className="swatch-check">✓</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemePicker;
