import { useEffect, useMemo, useState } from 'react';
import { Button, Chip, Input, Search } from '../../../../src';
import './ThemePlayground.css';

type BuiltInThemeId =
  | 'corporate'
  | 'default'
  | 'forest'
  | 'midnight'
  | 'ocean'
  | 'sand'
  | 'slate'
  | 'sunset';

type Mode = 'light' | 'dark';

type ThemeOption = {
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

const THEME_OPTIONS: ThemeOption[] = [
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

const THEME_STORAGE_KEY = 'mezmer-docs-theme';
const THEME_STYLESHEET_ID = 'mezmer-docs-theme-stylesheet';
const LEGACY_PREVIEW_THEME_STYLESHEET_ID =
  'mezmer-docs-component-preview-theme';

function getThemeStylesheetHref(theme: BuiltInThemeId): string {
  const basePath =
    (import.meta as ImportMeta & { env?: { BASE_URL?: string } }).env
      ?.BASE_URL || '/';
  return `${basePath}themes/${theme}.css`;
}

function ensureThemeStylesheet(theme: BuiltInThemeId): void {
  const href = getThemeStylesheetHref(theme);
  let link = document.getElementById(
    THEME_STYLESHEET_ID,
  ) as HTMLLinkElement | null;

  if (!link) {
    link = document.createElement('link');
    link.id = THEME_STYLESHEET_ID;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }

  if (link.href !== href) {
    link.href = href;
  }
}

function resolveInitialTheme(): BuiltInThemeId {
  const stored = globalThis.localStorage.getItem(THEME_STORAGE_KEY);
  const resolved = THEME_OPTIONS.find((option) => option.id === stored);

  if (resolved) {
    return resolved.id;
  }

  return 'default';
}

const TOKEN_SWATCHES: Array<{ label: string; token: string }> = [
  { label: 'Background', token: '--mz-background' },
  { label: 'Foreground', token: '--mz-foreground' },
  { label: 'Primary', token: '--mz-primary' },
  { label: 'Secondary', token: '--mz-secondary' },
  { label: 'Muted', token: '--mz-muted' },
  { label: 'Accent', token: '--mz-accent' },
  { label: 'Destructive', token: '--mz-destructive' },
  { label: 'Border', token: '--mz-border' },
];

type PreviewCardProps = Readonly<{
  mode: Mode;
  title: string;
  badge: string;
  email: string;
  searchValue: string;
  onEmailChange: (value: string) => void;
  onSearchChange: (value: string) => void;
}>;

function PreviewCard(props: PreviewCardProps) {
  const {
    mode,
    title,
    badge,
    email,
    searchValue,
    onEmailChange,
    onSearchChange,
  } = props;

  return (
    <article className={`mz-preview-card${mode === 'dark' ? ' dark' : ''}`}>
      <div className="mz-preview-card__surface">
        <div className="mz-preview-card__head">
          <div>
            <p className="mz-preview-card__eyebrow">Theme Preview</p>
            <h4 className="mz-preview-card__title">{title}</h4>
          </div>
          <span className="mz-preview-card__badge">{badge}</span>
        </div>

        <div className="mz-preview-card__stack">
          <Input
            name={`theme-preview-email-${mode}`}
            label="Email"
            placeholder="name@company.com"
            value={email}
            onChange={(event) => onEmailChange(event.target.value)}
          />

          <Search
            placeholder="Search components"
            value={searchValue}
            onChange={onSearchChange}
          />

          <div className="mz-preview-card__actions">
            <Button label="Primary" />
            <Button label="Secondary" variant="outline" />
            <Button label="Ghost" variant="ghost" />
          </div>

          <div className="mz-preview-card__chips">
            <Chip label="UI" />
            <Chip label="Theme" />
            <Chip label="Preview" />
          </div>

          <div
            className="mz-preview-card__token-grid"
            aria-label="Token swatches"
          >
            {TOKEN_SWATCHES.map((swatch) => (
              <span key={`${mode}-${swatch.token}`} className="mz-token-item">
                <span
                  className="mz-token-item__dot"
                  style={{ backgroundColor: `hsl(var(${swatch.token}))` }}
                  aria-hidden="true"
                />
                <span className="mz-token-item__label">{swatch.label}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

export function ThemePlayground() {
  const [theme, setTheme] = useState<BuiltInThemeId>('default');
  const [email, setEmail] = useState('');
  const [searchValue, setSearchValue] = useState('');

  const activeThemeIndex = THEME_OPTIONS.findIndex(
    (option) => option.id === theme,
  );

  const setThemeByIndex = (index: number) => {
    const normalizedIndex =
      (index + THEME_OPTIONS.length) % THEME_OPTIONS.length;
    setTheme(THEME_OPTIONS[normalizedIndex].id);
  };

  const handleThemeOptionKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      setThemeByIndex(index + 1);
      return;
    }

    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      setThemeByIndex(index - 1);
      return;
    }

    if (event.key === 'Home') {
      event.preventDefault();
      setThemeByIndex(0);
      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      setThemeByIndex(THEME_OPTIONS.length - 1);
    }
  };

  useEffect(() => {
    setTheme(resolveInitialTheme());

    const legacyPreviewStylesheet = document.getElementById(
      LEGACY_PREVIEW_THEME_STYLESHEET_ID,
    );

    if (legacyPreviewStylesheet) {
      legacyPreviewStylesheet.remove();
    }
  }, []);

  useEffect(() => {
    ensureThemeStylesheet(theme);
    globalThis.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const activeTheme = useMemo(
    () =>
      THEME_OPTIONS.find((option) => option.id === theme) ?? THEME_OPTIONS[0],
    [theme],
  );

  const panes: Array<{ mode: Mode; title: string; badge: string }> = [
    { mode: 'light', title: 'Light Surface', badge: 'Light' },
    { mode: 'dark', title: 'Dark Surface', badge: 'Dark' },
  ];

  return (
    <section className="mz-theme-playground" aria-label="Theme playground">
      <header className="mz-theme-playground__header">
        <div>
          <p className="mz-theme-playground__kicker">
            shadcn-style live preview
          </p>
          <h3 className="mz-theme-playground__title">Theme Playground</h3>
          <p className="mz-theme-playground__description">
            Pick a Mezmer theme and compare the same component surface in both
            light and dark, matching the shadcn-style preview behavior.
          </p>
        </div>
      </header>

      <div
        className="mz-theme-playground__theme-grid"
        role="radiogroup"
        aria-label="Available themes"
      >
        {THEME_OPTIONS.map((option, index) => {
          const isActive = option.id === theme;
          const palette = option.light;

          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={isActive}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setTheme(option.id)}
              onKeyDown={(event) => handleThemeOptionKeyDown(event, index)}
              className={`mz-theme-option${isActive ? ' is-active' : ''}`}
            >
              <span className="mz-theme-option__head">
                <span className="mz-theme-option__label">{option.label}</span>
                {isActive ? (
                  <span className="mz-theme-option__live">Live</span>
                ) : null}
              </span>

              <span className="mz-theme-option__swatches" aria-hidden="true">
                <span
                  className="mz-theme-option__dot"
                  style={{ backgroundColor: palette.primary }}
                />
                <span
                  className="mz-theme-option__dot"
                  style={{ backgroundColor: palette.accent }}
                />
                <span
                  className="mz-theme-option__dot"
                  style={{ backgroundColor: palette.surface }}
                />
              </span>

              <span className="mz-theme-option__note">{option.note}</span>
            </button>
          );
        })}
      </div>

      <div className="mz-theme-playground__preview-grid">
        {panes.map((pane) => (
          <PreviewCard
            key={pane.mode}
            mode={pane.mode}
            title={pane.title}
            badge={pane.badge}
            email={email}
            searchValue={searchValue}
            onEmailChange={setEmail}
            onSearchChange={setSearchValue}
          />
        ))}
      </div>

      <footer className="mz-theme-playground__footer">
        Active theme: <strong>{activeTheme.label}</strong> (
        {activeThemeIndex + 1}/{THEME_OPTIONS.length})
      </footer>
    </section>
  );
}
