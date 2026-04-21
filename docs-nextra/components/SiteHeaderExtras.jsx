import { useEffect, useMemo, useState } from 'react';
import { Palette } from 'lucide-react';
import { ThemeSwitch } from 'nextra-theme-docs';
import { DropDown } from '../../src/components/DropDown';
import { Icon } from '../../src/components/Icon';
import {
  applyRuntimeThemeStylesheet,
  resolveStoredThemeId,
  THEME_OPTIONS,
} from './siteTheme';

export function SiteHeaderExtras() {
  const [themeId, setThemeId] = useState('default');
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

  useEffect(() => {
    setThemeId(resolveStoredThemeId());
  }, []);

  useEffect(() => {
    applyRuntimeThemeStylesheet(themeId, basePath);
  }, [basePath, themeId]);

  const currentOption = useMemo(() => {
    return THEME_OPTIONS.find((option) => option.value === themeId)?.value;
  }, [themeId]);

  return (
    <div className="mz-site-header-tools">
      <div className="mz-theme-control">
        <DropDown
          value={currentOption}
          onChange={setThemeId}
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
      <ThemeSwitch lite className="mz-mode-toggle" />
    </div>
  );
}
