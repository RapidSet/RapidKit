'use client';

import { useEffect, useState } from 'react';
import {
  setDocsTheme,
  THEME_OPTIONS,
  THEME_CHANGE_EVENT,
  initializeDocsTheme,
  type BuiltInThemeId,
} from './docsTheme';

const PALETTE_TOKENS: Array<{ key: string; label: string }> = [
  { key: 'primary', label: 'Primary' },
  { key: 'accent', label: 'Accent' },
  { key: 'accent-2', label: 'Accent 2' },
  { key: 'accent-3', label: 'Accent 3' },
  { key: 'accent-4', label: 'Accent 4' },
  { key: 'success', label: 'Success' },
  { key: 'warning', label: 'Warning' },
  { key: 'info', label: 'Info' },
  { key: 'destructive', label: 'Destructive' },
];

const CHART_TOKENS = [
  'chart-1',
  'chart-2',
  'chart-3',
  'chart-4',
  'chart-5',
  'chart-6',
];

const PLAYGROUND_ANCHOR_ID = 'theme-playground';

export function ThemeGallery() {
  const [activeId, setActiveId] = useState<BuiltInThemeId>('default');
  const [darkPerCard, setDarkPerCard] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setActiveId(initializeDocsTheme());

    const handle = (event: Event) => {
      setActiveId((event as CustomEvent<BuiltInThemeId>).detail);
    };

    globalThis.addEventListener(THEME_CHANGE_EVENT, handle);
    return () => globalThis.removeEventListener(THEME_CHANGE_EVENT, handle);
  }, []);

  const handleSelect = (id: BuiltInThemeId) => {
    setDocsTheme(id);
    if (typeof document !== 'undefined') {
      const target = document.getElementById(PLAYGROUND_ANCHOR_ID);
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const toggleDark = (id: string) =>
    setDarkPerCard((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <section className="rk-theme-gallery" aria-label="Theme gallery">
      <div className="rk-theme-gallery__intro">
        <h3 className="rk-theme-gallery__title">Browse themes</h3>
        <p className="rk-theme-gallery__hint">
          Every theme rendered live. Click a card to load it into the playground
          below.
        </p>
      </div>

      <div className="rk-theme-gallery__grid">
        {THEME_OPTIONS.map((theme) => {
          const isActive = theme.id === activeId;
          const isDark = !!darkPerCard[theme.id];
          return (
            <button
              key={theme.id}
              type="button"
              data-rk-card-theme={theme.id}
              className={[
                'rk-theme-card',
                isDark ? 'dark' : '',
                isActive ? 'rk-theme-card--active' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => handleSelect(theme.id)}
              aria-label={`Activate ${theme.label} theme`}
              aria-pressed={isActive}
            >
              <div className="rk-theme-card__inner">
                <header className="rk-theme-card__head">
                  <div>
                    <div className="rk-theme-card__name">{theme.label}</div>
                    {theme.note ? (
                      <div className="rk-theme-card__note">{theme.note}</div>
                    ) : null}
                  </div>
                  <span
                    className="rk-theme-card__mode"
                    role="switch"
                    aria-checked={isDark}
                    aria-label={`Toggle dark mode for ${theme.label}`}
                    tabIndex={0}
                    onClick={(event) => {
                      event.stopPropagation();
                      toggleDark(theme.id);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        event.stopPropagation();
                        toggleDark(theme.id);
                      }
                    }}
                  >
                    {isDark ? 'Dark' : 'Light'}
                  </span>
                </header>

                <div className="rk-theme-card__palette" aria-hidden="true">
                  {PALETTE_TOKENS.map(({ key, label }) => (
                    <span
                      key={key}
                      className="rk-theme-card__swatch"
                      style={{ backgroundColor: `hsl(var(--rk-${key}))` }}
                      title={label}
                    />
                  ))}
                </div>

                <div className="rk-theme-card__components" aria-hidden="true">
                  <span className="rk-theme-card__chip rk-theme-card__chip--primary">
                    Primary
                  </span>
                  <span className="rk-theme-card__chip rk-theme-card__chip--outline">
                    Outline
                  </span>
                  <span className="rk-theme-card__badge rk-theme-card__badge--success">
                    Success
                  </span>
                  <span className="rk-theme-card__badge rk-theme-card__badge--warning">
                    Warning
                  </span>
                </div>

                <div className="rk-theme-card__chart" aria-hidden="true">
                  {CHART_TOKENS.map((token) => (
                    <span
                      key={token}
                      className="rk-theme-card__chart-bar"
                      style={{ backgroundColor: `hsl(var(--rk-${token}))` }}
                    />
                  ))}
                </div>

                <footer className="rk-theme-card__foot">
                  {isActive
                    ? 'Active — try the playground below'
                    : 'Click to apply'}
                </footer>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
