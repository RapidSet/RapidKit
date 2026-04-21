import { useEffect, useMemo, useRef, useState } from 'react';

const THEME_IDS = new Set([
  'default',
  'slate',
  'carbon',
  'corporate',
  'forest',
  'midnight',
  'ocean',
  'polaris',
  'sand',
  'sunset',
]);

const THEME_STORAGE_KEY = 'mezmer:landing-theme';
const MODE_STORAGE_KEY = 'mezmer:landing-mode';

export default function HomeLandingPage() {
  const [themeId, setThemeId] = useState('default');
  const [mode, setMode] = useState('light');
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const themeMenuRef = useRef(null);

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

  const toHref = useMemo(() => {
    return (path) => `${basePath}${path}`;
  }, [basePath]);

  useEffect(() => {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    const initialTheme =
      storedTheme && THEME_IDS.has(storedTheme) ? storedTheme : 'default';
    setThemeId(initialTheme);

    const storedMode = localStorage.getItem(MODE_STORAGE_KEY);
    const isDarkByClass = document.documentElement.classList.contains('dark');
    let initialMode = isDarkByClass ? 'dark' : 'light';

    if (storedMode === 'dark' || storedMode === 'light') {
      initialMode = storedMode;
    }

    setMode(initialMode);
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    const isDark = mode === 'dark';
    html.classList.toggle('dark', isDark);
    html.style.colorScheme = isDark ? 'dark' : 'light';
    localStorage.setItem(MODE_STORAGE_KEY, mode);
  }, [mode]);

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, themeId);

    const href = `${basePath}/themes/${themeId}.css`;
    const existing = document.getElementById('mz-runtime-theme');

    if (existing) {
      existing.setAttribute('href', href);
      return;
    }

    const link = document.createElement('link');
    link.id = 'mz-runtime-theme';
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }, [basePath, themeId]);

  useEffect(() => {
    if (!isThemeMenuOpen) {
      return undefined;
    }

    const handlePointerDown = (event) => {
      if (!themeMenuRef.current?.contains(event.target)) {
        setIsThemeMenuOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsThemeMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isThemeMenuOpen]);

  const toggleMode = () => {
    setMode((current) => (current === 'dark' ? 'light' : 'dark'));
  };

  const themeOptions = Array.from(THEME_IDS);

  const currentThemeLabel = themeId[0].toUpperCase() + themeId.slice(1);

  return (
    <div className="mz-home">
      <header className="mz-topbar" aria-label="Landing navigation">
        <a className="mz-logo" href={toHref('/')}>
          <span className="mz-logo-mark" aria-hidden="true">
            <span className="mz-logo-r">R</span>
            <span className="mz-logo-k">K</span>
          </span>
          <span className="mz-logo-name">RapidKit</span>
        </a>
        <nav className="mz-topnav">
          <a className="mz-topnav-link" href={toHref('/components/')}>
            Components
          </a>
          <a className="mz-topnav-link" href={toHref('/ARCHITECTURE/')}>
            Docs
          </a>
          <a className="mz-topnav-link" href={toHref('/THEMING/')}>
            Themes
          </a>
          <a className="mz-topnav-link" href={toHref('/MCP-SERVER/')}>
            MCP
          </a>
        </nav>
        <div className="mz-topbar-tools">
          <div className="mz-theme-menu" ref={themeMenuRef}>
            <button
              id="mz-theme-trigger"
              className="mz-select"
              type="button"
              aria-haspopup="listbox"
              aria-expanded={isThemeMenuOpen}
              aria-label="Theme selector"
              onClick={() => setIsThemeMenuOpen((current) => !current)}
            >
              <span>{currentThemeLabel}</span>
              <svg
                className="mz-select-caret"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M3 4.5 6 7.5 9 4.5" />
              </svg>
            </button>
            {isThemeMenuOpen ? (
              <div className="mz-theme-popover">
                <ul
                  className="mz-theme-list"
                  aria-labelledby="mz-theme-trigger"
                >
                  {themeOptions.map((id) => {
                    const label = id[0].toUpperCase() + id.slice(1);

                    return (
                      <li key={id}>
                        <button
                          className="mz-theme-option"
                          type="button"
                          data-active={themeId === id ? 'true' : 'false'}
                          aria-pressed={themeId === id}
                          onClick={() => {
                            setThemeId(id);
                            setIsThemeMenuOpen(false);
                          }}
                        >
                          {label}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : null}
          </div>
          <a className="mz-btn mz-btn-ghost" href={toHref('/components/')}>
            Docs
          </a>
          <a className="mz-btn mz-btn-primary" href={toHref('/components/')}>
            Get Started
          </a>
        </div>
        <button
          className="mz-mode-toggle"
          type="button"
          onClick={toggleMode}
          aria-label={
            mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
          }
        >
          {mode === 'dark' ? (
            <svg
              className="mz-mode-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2.2" />
              <path d="M12 19.8V22" />
              <path d="M4.93 4.93l1.56 1.56" />
              <path d="M17.51 17.51l1.56 1.56" />
              <path d="M2 12h2.2" />
              <path d="M19.8 12H22" />
              <path d="M4.93 19.07l1.56-1.56" />
              <path d="M17.51 6.49l1.56-1.56" />
            </svg>
          ) : (
            <svg
              className="mz-mode-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
            </svg>
          )}
        </button>
      </header>

      <section className="mz-hero">
        <article className="mz-hero-copy">
          <a className="mz-announcement" href={toHref('/ARCHITECTURE/')}>
            Standalone, reusable, publishable
          </a>
          <h1>AI-first React UI kit for production-grade delivery.</h1>
          <p className="mz-subtitle">
            RapidKit is a domain-neutral component library for external
            consumers, engineered for AI-assisted implementation with strict
            TypeScript APIs, contract-aligned docs, and tree-shakeable package
            exports.
          </p>
          <div className="mz-hero-actions">
            <a className="mz-btn mz-btn-primary" href={toHref('/components/')}>
              Start Building
            </a>
            <a className="mz-btn mz-btn-ghost" href={toHref('/components/')}>
              View Components
            </a>
          </div>
          <ul className="mz-hero-meta" aria-label="Highlights">
            <li>AI-first contract workflow</li>
            <li>Domain-neutral APIs</li>
            <li>Composable, accessible primitives</li>
          </ul>
        </article>
      </section>
    </div>
  );
}
