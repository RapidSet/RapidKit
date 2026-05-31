import themesData from '../themes-data.json';

type TokenMap = Record<string, string>;

type ThemeDataEntry = {
  id: string;
  displayName: string;
  note: string;
  light: TokenMap;
  dark: TokenMap;
};

export type BuiltInThemeId = string;

export type ThemeOption = {
  id: BuiltInThemeId;
  label: string;
  note: string;
  light: TokenMap;
  dark: TokenMap;
};

export const THEME_OPTIONS: ThemeOption[] = (
  themesData as ThemeDataEntry[]
).map((entry) => ({
  id: entry.id,
  label: entry.displayName,
  note: entry.note,
  light: entry.light,
  dark: entry.dark,
}));

const THEME_ID_SET = new Set(THEME_OPTIONS.map((option) => option.id));

export const THEME_STORAGE_KEY = 'rapidkit-docs-theme';
export const THEME_CHANGE_EVENT = 'rapidkit-docs-theme-change';
export const THEME_LINK_ID = 'rapidkit-docs-theme-stylesheet';
const LEGACY_SCOPED_THEME_STYLE_ID = 'rapidkit-docs-theme-style-scoped';
const LEGACY_PREVIEW_THEME_STYLESHEET_ID =
  'rapidkit-docs-component-preview-theme';

function isBuiltInThemeId(value: string | null): value is BuiltInThemeId {
  return value !== null && THEME_ID_SET.has(value);
}

export function getThemeStylesheetHref(theme: BuiltInThemeId): string {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

  return `${basePath}/themes/${theme}.css`;
}

export function cleanupLegacyThemeArtifacts(): void {
  if (typeof document === 'undefined') {
    return;
  }

  document.getElementById(LEGACY_SCOPED_THEME_STYLE_ID)?.remove();
  document.getElementById(LEGACY_PREVIEW_THEME_STYLESHEET_ID)?.remove();
}

export function resolveInitialTheme(): BuiltInThemeId {
  if (globalThis.localStorage === undefined) {
    return 'default';
  }

  const stored = globalThis.localStorage.getItem(THEME_STORAGE_KEY);

  if (isBuiltInThemeId(stored)) {
    return stored;
  }

  return 'default';
}

export function applyDocsTheme(theme: BuiltInThemeId): void {
  if (typeof document === 'undefined') {
    return;
  }

  const href = getThemeStylesheetHref(theme);
  let link = document.getElementById(THEME_LINK_ID) as HTMLLinkElement | null;

  if (!link) {
    link = document.createElement('link');
    link.id = THEME_LINK_ID;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }

  if (link.getAttribute('href') !== href) {
    link.setAttribute('href', href);
  }
}

export function setDocsTheme(theme: BuiltInThemeId): void {
  applyDocsTheme(theme);

  if (globalThis.localStorage !== undefined) {
    globalThis.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }

  if (globalThis.window !== undefined) {
    globalThis.dispatchEvent(
      new CustomEvent<BuiltInThemeId>(THEME_CHANGE_EVENT, {
        detail: theme,
      }),
    );
  }
}

export function initializeDocsTheme(): BuiltInThemeId {
  const theme = resolveInitialTheme();
  cleanupLegacyThemeArtifacts();
  applyDocsTheme(theme);
  return theme;
}
