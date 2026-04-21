import { useEffect } from 'react';
import { applyRuntimeThemeStylesheet, resolveStoredThemeId } from './siteTheme';

export function ThemeRuntime() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

  useEffect(() => {
    applyRuntimeThemeStylesheet(resolveStoredThemeId(), basePath);
  }, [basePath]);

  return null;
}
