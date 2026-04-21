import { useCallback, useEffect, useState } from 'react';
import { Moon, Palette, Sun } from 'lucide-react';
import { useTheme } from 'nextra-theme-docs';
import { DropDown } from '../../src/components/DropDown';
import { Icon } from '../../src/components/Icon';
import {
  applyRuntimeThemeStylesheet,
  resolveStoredThemeId,
  THEME_OPTIONS,
} from './siteTheme';

export function SiteHeaderExtras() {
  const [themeId, setThemeId] = useState('default');
  const { resolvedTheme, setTheme } = useTheme();
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

  useEffect(() => {
    setThemeId(resolveStoredThemeId());
  }, []);

  useEffect(() => {
    applyRuntimeThemeStylesheet(themeId, basePath);
  }, [basePath, themeId]);

  const handleThemeChange = useCallback(
    (nextThemeId) => {
      setThemeId(nextThemeId);
      applyRuntimeThemeStylesheet(nextThemeId, basePath);
    },
    [basePath],
  );

  const isDarkMode = resolvedTheme === 'dark';

  const handleModeToggle = useCallback(() => {
    setTheme(isDarkMode ? 'light' : 'dark');
  }, [isDarkMode, setTheme]);

  return (
    <div className="mz-site-header-tools">
      <div className="mz-theme-control">
        <DropDown
          value={themeId}
          onChange={handleThemeChange}
          options={THEME_OPTIONS}
          placeholder="Theme"
          className="mz-theme-dropdown"
          renderOption={(option) => (
            <span className="mz-theme-option-label">
              <Icon
                icon={Palette}
                className="mz-theme-option-icon"
                aria-hidden="true"
              />
              {option.label}
            </span>
          )}
        />
      </div>
      <button
        type="button"
        className="mz-mode-toggle"
        onClick={handleModeToggle}
        aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        title={isDarkMode ? 'Light mode' : 'Dark mode'}
      >
        <Icon
          icon={isDarkMode ? Sun : Moon}
          className="mz-mode-icon"
          aria-hidden="true"
        />
      </button>
    </div>
  );
}
