import {
  THEME_CHANGE_EVENT,
  THEME_LINK_ID,
  THEME_OPTIONS as DOCS_THEME_OPTIONS,
  THEME_STORAGE_KEY as DOCS_THEME_STORAGE_KEY,
  applyDocsTheme,
} from './docsTheme';

export const THEME_IDS = [
  'default',
  'slate',
  'carbon',
  'corporate',
  'forest',
  'midnight',
  'monday',
  'ocean',
  'polaris',
  'sand',
  'sunset',
];

export const THEME_OPTIONS = DOCS_THEME_OPTIONS.map(({ id, label }) => ({
  value: id,
  label,
}));

export const THEME_STORAGE_KEY = DOCS_THEME_STORAGE_KEY;
export const MODE_STORAGE_KEY = 'rapidkit:landing-mode';
export const RUNTIME_THEME_LINK_ID = THEME_LINK_ID;
const LEGACY_RUNTIME_THEME_LINK_ID = 'rk-runtime-theme';

export const resolveStoredThemeId = () => {
  if (globalThis.localStorage === undefined) {
    return 'default';
  }

  const storedTheme = globalThis.localStorage.getItem(THEME_STORAGE_KEY);
  return storedTheme && THEME_IDS.includes(storedTheme)
    ? storedTheme
    : 'default';
};

export const PREVIEW_MESSAGE_SET_THEME = 'rapidkit:set-theme';
export const PREVIEW_MESSAGE_READY = 'rapidkit:preview-ready';

const broadcastToPreviewIframes = (payload) => {
  if (typeof document === 'undefined' || typeof window === 'undefined') {
    return;
  }

  const iframes = document.querySelectorAll('iframe[data-rk-preview="true"]');

  iframes.forEach((iframe) => {
    try {
      iframe.contentWindow?.postMessage(
        { type: PREVIEW_MESSAGE_SET_THEME, ...payload },
        window.location.origin,
      );
    } catch {
      // Cross-origin or detached frames are not addressable; ignore.
    }
  });
};

export const broadcastModeToPreviewIframes = (mode) => {
  broadcastToPreviewIframes({ mode });
};

export const applyRuntimeThemeStylesheet = (themeId) => {
  if (typeof document === 'undefined') {
    return;
  }

  // Clean up old runtime link id from previous implementations.
  if (LEGACY_RUNTIME_THEME_LINK_ID !== RUNTIME_THEME_LINK_ID) {
    document.getElementById(LEGACY_RUNTIME_THEME_LINK_ID)?.remove();
  }

  const resolvedTheme = THEME_IDS.includes(themeId) ? themeId : 'default';
  applyDocsTheme(resolvedTheme);

  if (globalThis.localStorage !== undefined) {
    globalThis.localStorage.setItem(THEME_STORAGE_KEY, resolvedTheme);
  }

  if (globalThis.window !== undefined) {
    globalThis.dispatchEvent(
      new CustomEvent(THEME_CHANGE_EVENT, {
        detail: resolvedTheme,
      }),
    );
  }

  broadcastToPreviewIframes({ themeId: resolvedTheme });
};
