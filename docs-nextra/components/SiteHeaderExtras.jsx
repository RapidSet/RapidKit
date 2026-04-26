import { useCallback, useEffect, useState } from 'react';
import { Github, Moon, Palette, Sun } from 'lucide-react';
import { useTheme } from 'nextra-theme-docs';
import { DropDown } from '../../src/components/DropDown';
import { Icon } from '../../src/components/Icon';
import {
  applyRuntimeThemeStylesheet,
  MODE_STORAGE_KEY,
  resolveStoredThemeId,
  THEME_OPTIONS,
} from './siteTheme';

const resolveDocumentMode = () => {
  if (typeof document === 'undefined') {
    return 'light';
  }

  const root = document.documentElement;
  if (
    root.classList.contains('dark') ||
    root.dataset.theme === 'dark' ||
    root.dataset.colorMode === 'dark'
  ) {
    return 'dark';
  }

  if (globalThis.localStorage !== undefined) {
    const stored = globalThis.localStorage.getItem(MODE_STORAGE_KEY);
    if (stored === 'dark' || stored === 'light') {
      return stored;
    }
  }

  return 'light';
};

const applyDocumentMode = (mode) => {
  if (typeof document === 'undefined') {
    return;
  }

  const root = document.documentElement;
  const isDark = mode === 'dark';

  root.classList.toggle('dark', isDark);
  root.dataset.theme = mode;
  root.dataset.colorMode = mode;

  if (globalThis.localStorage !== undefined) {
    globalThis.localStorage.setItem(MODE_STORAGE_KEY, mode);
  }
};

export function SiteHeaderExtras() {
  const [themeId, setThemeId] = useState('default');
  const [fallbackMode, setFallbackMode] = useState('light');
  const [isMounted, setIsMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setIsMounted(true);
    setThemeId(resolveStoredThemeId());
    setFallbackMode(resolveDocumentMode());
  }, []);

  useEffect(() => {
    applyRuntimeThemeStylesheet(themeId);
  }, [themeId]);

  const handleThemeChange = useCallback((nextThemeId) => {
    setThemeId(nextThemeId);
    applyRuntimeThemeStylesheet(nextThemeId);
  }, []);

  const hasResolvedMode = resolvedTheme === 'dark' || resolvedTheme === 'light';
  const hydratedMode = hasResolvedMode ? resolvedTheme : fallbackMode;
  const currentMode = isMounted ? hydratedMode : 'light';
  const isDarkMode = currentMode === 'dark';

  const handleModeToggle = useCallback(() => {
    const nextMode = isDarkMode ? 'light' : 'dark';

    setTheme(nextMode);
    applyDocumentMode(nextMode);
    setFallbackMode(nextMode);
  }, [isDarkMode, setTheme]);

  return (
    <div className="rk-site-header-tools">
      <div className="rk-theme-control">
        <DropDown
          value={themeId}
          onChange={handleThemeChange}
          options={THEME_OPTIONS}
          placeholder="Theme"
          className="rk-theme-dropdown"
          renderOption={(option) => (
            <span className="rk-theme-option-label">
              <Icon
                icon={Palette}
                className="rk-theme-option-icon"
                aria-hidden="true"
              />
              {option.label}
            </span>
          )}
        />
      </div>
      <button
        type="button"
        className="rk-mode-toggle"
        onClick={handleModeToggle}
        aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        title={isDarkMode ? 'Light mode' : 'Dark mode'}
      >
        <Icon
          icon={isDarkMode ? Sun : Moon}
          className="rk-mode-icon"
          aria-hidden="true"
        />
      </button>
      <a
        className="rk-github-link"
        href="https://github.com/RapidSet/RapidKit"
        target="_blank"
        rel="noreferrer"
        aria-label="RapidKit GitHub repository"
        title="GitHub"
      >
        <Icon icon={Github} className="rk-github-icon" aria-hidden="true" />
      </a>
    </div>
  );
}
