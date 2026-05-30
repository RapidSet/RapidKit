import { useEffect } from 'react';
import {
  PREVIEW_MESSAGE_READY,
  PREVIEW_MESSAGE_SET_THEME,
  applyRuntimeThemeStylesheet,
} from './siteTheme';

type PreviewThemeMessage = {
  type?: unknown;
  themeId?: unknown;
  mode?: unknown;
};

export function useDocsPreviewThemeBridge(id: string): void {
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) {
        return;
      }

      if (event.source !== window.parent) {
        return;
      }

      const data = event.data as PreviewThemeMessage | undefined;

      if (!data || data.type !== PREVIEW_MESSAGE_SET_THEME) {
        return;
      }

      if (typeof data.themeId === 'string') {
        applyRuntimeThemeStylesheet(data.themeId);
      }

      if (data.mode === 'dark' || data.mode === 'light') {
        const root = document.documentElement;
        root.classList.toggle('dark', data.mode === 'dark');
        root.dataset.theme = data.mode;
        root.dataset.colorMode = data.mode;
      }
    };

    window.addEventListener('message', handleMessage);

    if (window.parent && window.parent !== window) {
      try {
        window.parent.postMessage(
          { type: PREVIEW_MESSAGE_READY, id },
          window.location.origin,
        );
      } catch {
        // parent may be cross-origin; ignore
      }
    }

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [id]);
}
