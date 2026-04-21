import { useEffect } from 'react';
import { applyRuntimeThemeStylesheet, resolveStoredThemeId } from './siteTheme';

export function ThemeRuntime() {
  useEffect(() => {
    applyRuntimeThemeStylesheet(resolveStoredThemeId());
  }, []);

  return null;
}
