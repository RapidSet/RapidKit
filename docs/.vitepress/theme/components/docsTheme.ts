export type BuiltInThemeId =
  | 'carbon'
  | 'corporate'
  | 'default'
  | 'forest'
  | 'midnight'
  | 'ocean'
  | 'polaris'
  | 'sand'
  | 'slate'
  | 'sunset';

export type ThemeOption = {
  id: BuiltInThemeId;
  label: string;
  note: string;
  light: {
    primary: string;
    accent: string;
    surface: string;
  };
  dark: {
    primary: string;
    accent: string;
    surface: string;
  };
};

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'carbon',
    label: 'Carbon',
    note: 'ibm-style precision',
    light: {
      primary: 'hsl(214 100% 40%)',
      accent: 'hsl(205 92% 36%)',
      surface: 'hsl(210 20% 98%)',
    },
    dark: {
      primary: 'hsl(214 96% 68%)',
      accent: 'hsl(201 76% 58%)',
      surface: 'hsl(215 28% 9%)',
    },
  },
  {
    id: 'default',
    label: 'Default',
    note: 'shadcn baseline',
    light: {
      primary: 'hsl(221.2 83.2% 53.3%)',
      accent: 'hsl(210 40% 96.1%)',
      surface: 'hsl(0 0% 100%)',
    },
    dark: {
      primary: 'hsl(217.2 91.2% 59.8%)',
      accent: 'hsl(217.2 32.6% 17.5%)',
      surface: 'hsl(222.2 84% 4.9%)',
    },
  },
  {
    id: 'corporate',
    label: 'Corporate',
    note: 'enterprise tone',
    light: {
      primary: 'hsl(221 65% 35%)',
      accent: 'hsl(199 72% 45%)',
      surface: 'hsl(210 33% 98%)',
    },
    dark: {
      primary: 'hsl(210 92% 73%)',
      accent: 'hsl(198 70% 52%)',
      surface: 'hsl(222 39% 11%)',
    },
  },
  {
    id: 'forest',
    label: 'Forest',
    note: 'organic contrast',
    light: {
      primary: 'hsl(142 58% 33%)',
      accent: 'hsl(88 45% 48%)',
      surface: 'hsl(114 38% 97%)',
    },
    dark: {
      primary: 'hsl(141 50% 58%)',
      accent: 'hsl(88 38% 45%)',
      surface: 'hsl(128 30% 9%)',
    },
  },
  {
    id: 'midnight',
    label: 'Midnight',
    note: 'high contrast cool',
    light: {
      primary: 'hsl(245 75% 58%)',
      accent: 'hsl(278 68% 58%)',
      surface: 'hsl(228 34% 96%)',
    },
    dark: {
      primary: 'hsl(246 86% 70%)',
      accent: 'hsl(278 67% 63%)',
      surface: 'hsl(232 35% 8%)',
    },
  },
  {
    id: 'ocean',
    label: 'Ocean',
    note: 'clean and vibrant',
    light: {
      primary: 'hsl(200 88% 42%)',
      accent: 'hsl(174 54% 47%)',
      surface: 'hsl(196 55% 97%)',
    },
    dark: {
      primary: 'hsl(197 88% 60%)',
      accent: 'hsl(173 48% 39%)',
      surface: 'hsl(208 53% 9%)',
    },
  },
  {
    id: 'polaris',
    label: 'Polaris',
    note: 'shopify-inspired clarity',
    light: {
      primary: 'hsl(217 72% 47%)',
      accent: 'hsl(169 46% 40%)',
      surface: 'hsl(210 24% 99%)',
    },
    dark: {
      primary: 'hsl(214 88% 70%)',
      accent: 'hsl(169 40% 52%)',
      surface: 'hsl(222 26% 12%)',
    },
  },
  {
    id: 'sand',
    label: 'Sand',
    note: 'warm palette',
    light: {
      primary: 'hsl(28 74% 46%)',
      accent: 'hsl(16 66% 56%)',
      surface: 'hsl(42 56% 97%)',
    },
    dark: {
      primary: 'hsl(30 82% 63%)',
      accent: 'hsl(16 66% 58%)',
      surface: 'hsl(30 25% 10%)',
    },
  },
  {
    id: 'slate',
    label: 'Slate',
    note: 'neutral utility',
    light: {
      primary: 'hsl(215 27.9% 16.9%)',
      accent: 'hsl(214 32% 91%)',
      surface: 'hsl(210 40% 98%)',
    },
    dark: {
      primary: 'hsl(210 40% 98%)',
      accent: 'hsl(217.2 32.6% 20%)',
      surface: 'hsl(222.2 47.4% 8.5%)',
    },
  },
  {
    id: 'sunset',
    label: 'Sunset',
    note: 'expressive blend',
    light: {
      primary: 'hsl(17 84% 54%)',
      accent: 'hsl(335 74% 58%)',
      surface: 'hsl(28 70% 97%)',
    },
    dark: {
      primary: 'hsl(20 90% 63%)',
      accent: 'hsl(336 64% 60%)',
      surface: 'hsl(14 30% 10%)',
    },
  },
];

export const THEME_STORAGE_KEY = 'mezmer-docs-theme';
export const THEME_CHANGE_EVENT = 'mezmer-docs-theme-change';
export const THEME_LINK_ID = 'mezmer-docs-theme-stylesheet';
const LEGACY_SCOPED_THEME_STYLE_ID = 'mezmer-docs-theme-style-scoped';
const LEGACY_PREVIEW_THEME_STYLESHEET_ID =
  'mezmer-docs-component-preview-theme';

function isBuiltInThemeId(value: string | null): value is BuiltInThemeId {
  return THEME_OPTIONS.some((option) => option.id === value);
}

export function getThemeStylesheetHref(theme: BuiltInThemeId): string {
  const basePath =
    (import.meta as ImportMeta & { env?: { BASE_URL?: string } }).env
      ?.BASE_URL || '/';

  return `${basePath}themes/${theme}.css`;
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
