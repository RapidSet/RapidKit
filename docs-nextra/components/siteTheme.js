export const THEME_IDS = [
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
];

export const THEME_OPTIONS = THEME_IDS.map((id) => ({
  value: id,
  label: id[0].toUpperCase() + id.slice(1),
}));

export const THEME_STORAGE_KEY = 'mezmer:landing-theme';
export const MODE_STORAGE_KEY = 'mezmer:landing-mode';
export const RUNTIME_THEME_LINK_ID = 'mz-runtime-theme';

export const resolveStoredThemeId = () => {
  if (typeof globalThis.localStorage === 'undefined') {
    return 'default';
  }

  const storedTheme = globalThis.localStorage.getItem(THEME_STORAGE_KEY);
  return storedTheme && THEME_IDS.includes(storedTheme)
    ? storedTheme
    : 'default';
};

export const applyRuntimeThemeStylesheet = (themeId, basePath = '') => {
  if (typeof document === 'undefined') {
    return;
  }

  const resolvedTheme = THEME_IDS.includes(themeId) ? themeId : 'default';
  const href = `${basePath}/themes/${resolvedTheme}.css`;
  const existing = document.getElementById(RUNTIME_THEME_LINK_ID);

  if (existing) {
    existing.setAttribute('href', href);
  } else {
    const link = document.createElement('link');
    link.id = RUNTIME_THEME_LINK_ID;
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }

  if (typeof globalThis.localStorage !== 'undefined') {
    globalThis.localStorage.setItem(THEME_STORAGE_KEY, resolvedTheme);
  }
};
