import { useEffect, useMemo, useState } from 'react';
import { Button, Chip, DatePicker, Input, Search } from '../../../../src';
import type { DatePickerChange } from '../../../../src/components/DatePicker/types';

type BuiltInThemeId =
  | 'corporate'
  | 'default'
  | 'forest'
  | 'midnight'
  | 'ocean'
  | 'sand'
  | 'slate'
  | 'sunset';
type ThemeId = BuiltInThemeId | 'ai-brand';
type Mode = 'light' | 'dark';
type GalleryPreviewMode = Mode | 'follow';
type BrandTone = 'balanced' | 'vibrant' | 'executive';

const BUILT_IN_THEMES: Array<{ id: BuiltInThemeId; label: string }> = [
  { id: 'corporate', label: 'Corporate' },
  { id: 'default', label: 'Default' },
  { id: 'forest', label: 'Forest' },
  { id: 'midnight', label: 'Midnight' },
  { id: 'ocean', label: 'Ocean' },
  { id: 'sand', label: 'Sand' },
  { id: 'slate', label: 'Slate' },
  { id: 'sunset', label: 'Sunset' },
];

type ThemeSwatchPalette = {
  surface: string;
  border: string;
  primary: string;
  accent: string;
};

type ThemeSwatchEntry = {
  light: ThemeSwatchPalette;
  dark: ThemeSwatchPalette;
  note: string;
};

const BUILT_IN_THEME_SWATCHES: Record<BuiltInThemeId, ThemeSwatchEntry> = {
  corporate: {
    light: {
      surface: 'hsl(210 33% 98%)',
      border: 'hsl(214 24% 82%)',
      primary: 'hsl(221 65% 35%)',
      accent: 'hsl(199 72% 45%)',
    },
    dark: {
      surface: 'hsl(222 39% 11%)',
      border: 'hsl(219 16% 28%)',
      primary: 'hsl(210 92% 73%)',
      accent: 'hsl(198 70% 52%)',
    },
    note: 'Formal and enterprise-safe',
  },
  default: {
    light: {
      surface: 'hsl(0 0% 100%)',
      border: 'hsl(214.3 31.8% 91.4%)',
      primary: 'hsl(221.2 83.2% 53.3%)',
      accent: 'hsl(210 40% 96.1%)',
    },
    dark: {
      surface: 'hsl(222.2 84% 4.9%)',
      border: 'hsl(217.2 32.6% 17.5%)',
      primary: 'hsl(217.2 91.2% 59.8%)',
      accent: 'hsl(217.2 32.6% 17.5%)',
    },
    note: 'Clean neutral baseline',
  },
  forest: {
    light: {
      surface: 'hsl(114 38% 97%)',
      border: 'hsl(114 20% 80%)',
      primary: 'hsl(142 58% 33%)',
      accent: 'hsl(88 45% 48%)',
    },
    dark: {
      surface: 'hsl(128 30% 9%)',
      border: 'hsl(126 14% 26%)',
      primary: 'hsl(141 50% 58%)',
      accent: 'hsl(88 38% 45%)',
    },
    note: 'Organic and calm',
  },
  midnight: {
    light: {
      surface: 'hsl(228 34% 96%)',
      border: 'hsl(233 20% 81%)',
      primary: 'hsl(245 75% 58%)',
      accent: 'hsl(278 68% 58%)',
    },
    dark: {
      surface: 'hsl(232 35% 8%)',
      border: 'hsl(233 14% 27%)',
      primary: 'hsl(246 86% 70%)',
      accent: 'hsl(278 67% 63%)',
    },
    note: 'Tech-forward contrast',
  },
  ocean: {
    light: {
      surface: 'hsl(196 55% 97%)',
      border: 'hsl(197 34% 82%)',
      primary: 'hsl(200 88% 42%)',
      accent: 'hsl(174 54% 47%)',
    },
    dark: {
      surface: 'hsl(208 53% 9%)',
      border: 'hsl(203 30% 26%)',
      primary: 'hsl(197 88% 60%)',
      accent: 'hsl(173 48% 39%)',
    },
    note: 'Cool and trustworthy',
  },
  sand: {
    light: {
      surface: 'hsl(42 56% 97%)',
      border: 'hsl(38 30% 80%)',
      primary: 'hsl(28 74% 46%)',
      accent: 'hsl(16 66% 56%)',
    },
    dark: {
      surface: 'hsl(30 25% 10%)',
      border: 'hsl(30 15% 27%)',
      primary: 'hsl(30 82% 63%)',
      accent: 'hsl(16 66% 58%)',
    },
    note: 'Warm and approachable',
  },
  slate: {
    light: {
      surface: 'hsl(210 40% 98%)',
      border: 'hsl(214.3 31.8% 84%)',
      primary: 'hsl(215 27.9% 16.9%)',
      accent: 'hsl(214 32% 91%)',
    },
    dark: {
      surface: 'hsl(222.2 47.4% 8.5%)',
      border: 'hsl(217.2 32.6% 24%)',
      primary: 'hsl(210 40% 98%)',
      accent: 'hsl(217.2 32.6% 20%)',
    },
    note: 'Muted professional tone',
  },
  sunset: {
    light: {
      surface: 'hsl(28 70% 97%)',
      border: 'hsl(24 34% 80%)',
      primary: 'hsl(17 84% 54%)',
      accent: 'hsl(335 74% 58%)',
    },
    dark: {
      surface: 'hsl(14 30% 10%)',
      border: 'hsl(16 14% 28%)',
      primary: 'hsl(20 90% 63%)',
      accent: 'hsl(336 64% 60%)',
    },
    note: 'Bold and expressive',
  },
};

const THEME_STORAGE_KEY = 'mezmer-docs-theme';
const MODE_STORAGE_KEY = 'mezmer-docs-mode';
const THEME_STYLESHEET_ID = 'mezmer-docs-theme-stylesheet';
const AI_THEME_STORAGE_KEY = 'mezmer-docs-ai-theme-css';
const AI_THEME_STYLE_ID = 'mezmer-docs-ai-theme-style';

const REQUIRED_TOKENS = [
  '--mz-background',
  '--mz-foreground',
  '--mz-card',
  '--mz-card-foreground',
  '--mz-popover',
  '--mz-popover-foreground',
  '--mz-primary',
  '--mz-primary-foreground',
  '--mz-secondary',
  '--mz-secondary-foreground',
  '--mz-muted',
  '--mz-muted-foreground',
  '--mz-accent',
  '--mz-accent-foreground',
  '--mz-destructive',
  '--mz-destructive-foreground',
  '--mz-border',
  '--mz-input',
  '--mz-ring',
  '--mz-radius',
] as const;

function parseHexColor(value: string): [number, number, number] | null {
  const cleaned = value.trim().replace('#', '');
  const normalized =
    cleaned.length === 3
      ? cleaned
          .split('')
          .map((part) => `${part}${part}`)
          .join('')
      : cleaned;

  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) {
    return null;
  }

  const red = Number.parseInt(normalized.slice(0, 2), 16);
  const green = Number.parseInt(normalized.slice(2, 4), 16);
  const blue = Number.parseInt(normalized.slice(4, 6), 16);

  return [red, green, blue];
}

function rgbToHsl(
  red: number,
  green: number,
  blue: number,
): [number, number, number] {
  const r = red / 255;
  const g = green / 255;
  const b = blue / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let hue = 0;
  if (delta !== 0) {
    if (max === r) {
      hue = ((g - b) / delta) % 6;
    } else if (max === g) {
      hue = (b - r) / delta + 2;
    } else {
      hue = (r - g) / delta + 4;
    }
  }

  hue = Math.round(hue * 60);
  if (hue < 0) {
    hue += 360;
  }

  const lightness = (max + min) / 2;
  const saturation =
    delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1));

  return [
    hue,
    Number((saturation * 100).toFixed(1)),
    Number((lightness * 100).toFixed(1)),
  ];
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function hslToken(hue: number, saturation: number, lightness: number): string {
  return `${Math.round(hue)} ${Number(saturation.toFixed(1))}% ${Number(lightness.toFixed(1))}%`;
}

function withToneSaturation(base: number, tone: BrandTone): number {
  if (tone === 'vibrant') {
    return clamp(base + 12, 8, 95);
  }

  if (tone === 'executive') {
    return clamp(base - 10, 8, 85);
  }

  return clamp(base, 8, 90);
}

function makeThemeCss(
  primaryHex: string,
  accentHex: string,
  tone: BrandTone,
  radius: string,
): string {
  const primaryRgb = parseHexColor(primaryHex) ?? [59, 130, 246];
  const accentRgb = parseHexColor(accentHex) ?? [20, 184, 166];

  const [primaryHue, primarySatRaw, primaryLightRaw] = rgbToHsl(
    primaryRgb[0],
    primaryRgb[1],
    primaryRgb[2],
  );
  const [accentHue, accentSatRaw, accentLightRaw] = rgbToHsl(
    accentRgb[0],
    accentRgb[1],
    accentRgb[2],
  );
  const neutralHue = primaryHue;
  const primarySat = withToneSaturation(primarySatRaw, tone);
  const accentSat = withToneSaturation(accentSatRaw, tone);

  const rootTokens: Record<string, string> = {
    '--mz-background': hslToken(neutralHue, 20, 98),
    '--mz-foreground': hslToken(neutralHue, 28, 14),
    '--mz-card': hslToken(neutralHue, 18, 99),
    '--mz-card-foreground': hslToken(neutralHue, 28, 14),
    '--mz-popover': hslToken(neutralHue, 18, 99),
    '--mz-popover-foreground': hslToken(neutralHue, 28, 14),
    '--mz-primary': hslToken(
      primaryHue,
      primarySat,
      clamp(primaryLightRaw, 30, 55),
    ),
    '--mz-primary-foreground': hslToken(primaryHue, 40, 98),
    '--mz-secondary': hslToken(neutralHue, 22, 92),
    '--mz-secondary-foreground': hslToken(neutralHue, 28, 16),
    '--mz-muted': hslToken(neutralHue, 18, 94),
    '--mz-muted-foreground': hslToken(neutralHue, 14, 38),
    '--mz-accent': hslToken(
      accentHue,
      accentSat,
      clamp(accentLightRaw, 45, 70),
    ),
    '--mz-accent-foreground': hslToken(accentHue, 28, 14),
    '--mz-destructive': hslToken(0, 72, 50),
    '--mz-destructive-foreground': hslToken(0, 0, 98),
    '--mz-border': hslToken(neutralHue, 20, 84),
    '--mz-input': hslToken(neutralHue, 20, 84),
    '--mz-ring': hslToken(
      primaryHue,
      primarySat,
      clamp(primaryLightRaw + 8, 42, 64),
    ),
    '--mz-radius': radius,
  };

  const darkTokens: Record<string, string> = {
    '--mz-background': hslToken(neutralHue, 30, 9),
    '--mz-foreground': hslToken(neutralHue, 16, 96),
    '--mz-card': hslToken(neutralHue, 26, 12),
    '--mz-card-foreground': hslToken(neutralHue, 16, 96),
    '--mz-popover': hslToken(neutralHue, 26, 12),
    '--mz-popover-foreground': hslToken(neutralHue, 16, 96),
    '--mz-primary': hslToken(
      primaryHue,
      primarySat,
      clamp(primaryLightRaw + 18, 55, 78),
    ),
    '--mz-primary-foreground': hslToken(primaryHue, 28, 14),
    '--mz-secondary': hslToken(neutralHue, 22, 20),
    '--mz-secondary-foreground': hslToken(neutralHue, 16, 96),
    '--mz-muted': hslToken(neutralHue, 20, 20),
    '--mz-muted-foreground': hslToken(neutralHue, 14, 72),
    '--mz-accent': hslToken(
      accentHue,
      accentSat,
      clamp(accentLightRaw - 10, 26, 48),
    ),
    '--mz-accent-foreground': hslToken(accentHue, 20, 96),
    '--mz-destructive': hslToken(0, 63, 39),
    '--mz-destructive-foreground': hslToken(0, 0, 98),
    '--mz-border': hslToken(neutralHue, 18, 24),
    '--mz-input': hslToken(neutralHue, 18, 24),
    '--mz-ring': hslToken(
      primaryHue,
      primarySat,
      clamp(primaryLightRaw + 18, 55, 78),
    ),
    '--mz-radius': radius,
  };

  const toCssBlock = (selector: string, tokens: Record<string, string>) => {
    const lines = REQUIRED_TOKENS.map(
      (token) => `  ${token}: ${tokens[token]};`,
    ).join('\n');
    return `${selector} {\n${lines}\n}`;
  };

  return `${toCssBlock(':root', rootTokens)}\n\n${toCssBlock('.dark', darkTokens)}`;
}

function buildThemeCreateCommand(id: string): string {
  return `pnpm theme:create --id ${id} --from default`;
}

function buildThemeContractSnippet(themeId: string, brandName: string): string {
  return JSON.stringify(
    {
      id: themeId || 'brand-theme',
      displayName: brandName || 'Brand Theme',
      extendsTheme: 'default',
      cssPath: `src/themes/${themeId || 'brand-theme'}.css`,
      modes: ['light', 'dark'],
      tokenPrefix: '--mz-',
      tokenCoverage: REQUIRED_TOKENS,
    },
    null,
    2,
  );
}

function triggerTextDownload(fileName: string, content: string): void {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = globalThis.URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = fileName;
  anchor.click();

  globalThis.URL.revokeObjectURL(url);
}

function getThemeStylesheetHref(theme: ThemeId): string {
  const basePath =
    (import.meta as ImportMeta & { env?: { BASE_URL?: string } }).env
      ?.BASE_URL || '/';
  return `${basePath}themes/${theme}.css`;
}

function ensureThemeStylesheet(theme: ThemeId): void {
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

function resolveInitialTheme(): ThemeId {
  const stored = globalThis.localStorage.getItem(THEME_STORAGE_KEY);
  const isBuiltInTheme = BUILT_IN_THEMES.some((theme) => theme.id === stored);

  if (isBuiltInTheme || stored === 'ai-brand') {
    return stored as ThemeId;
  }

  return 'default';
}

function resolveInitialMode(): Mode {
  const stored = globalThis.localStorage.getItem(MODE_STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }

  return 'light';
}

export function ThemePlayground() {
  const [theme, setTheme] = useState<ThemeId>('default');
  const [mode, setMode] = useState<Mode>('light');
  const [email, setEmail] = useState('');
  const [selectedDate, setSelectedDate] = useState<string | undefined>();
  const [searchValue, setSearchValue] = useState('');
  const [brandName, setBrandName] = useState('Acme Systems');
  const [themeId, setThemeId] = useState('acme-systems');
  const [primaryHex, setPrimaryHex] = useState('#2563eb');
  const [accentHex, setAccentHex] = useState('#14b8a6');
  const [tone, setTone] = useState<BrandTone>('balanced');
  const [radius, setRadius] = useState('0.625rem');
  const [generatedThemeCss, setGeneratedThemeCss] = useState<string | null>(
    null,
  );
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);
  const [galleryMode, setGalleryMode] = useState<GalleryPreviewMode>('follow');

  useEffect(() => {
    setTheme(resolveInitialTheme());
    setMode(resolveInitialMode());

    const storedAiThemeCss =
      globalThis.localStorage.getItem(AI_THEME_STORAGE_KEY);
    if (storedAiThemeCss) {
      setGeneratedThemeCss(storedAiThemeCss);
    }
  }, []);

  useEffect(() => {
    if (theme === 'ai-brand') {
      ensureThemeStylesheet('default');
    } else {
      ensureThemeStylesheet(theme);
    }
    globalThis.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', mode === 'dark');
    globalThis.localStorage.setItem(MODE_STORAGE_KEY, mode);
  }, [mode]);

  useEffect(() => {
    let styleTag = document.getElementById(
      AI_THEME_STYLE_ID,
    ) as HTMLStyleElement | null;

    if (!generatedThemeCss) {
      if (styleTag) {
        styleTag.remove();
      }
      return;
    }

    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = AI_THEME_STYLE_ID;
      document.head.appendChild(styleTag);
    }

    styleTag.textContent = generatedThemeCss;
    globalThis.localStorage.setItem(AI_THEME_STORAGE_KEY, generatedThemeCss);
  }, [generatedThemeCss]);

  const activeThemeLabel = useMemo(() => `${theme} / ${mode}`, [mode, theme]);
  const generatedThemeCommand = useMemo(
    () => buildThemeCreateCommand(themeId || 'brand-theme'),
    [themeId],
  );
  const generatedThemeContractSnippet = useMemo(
    () => buildThemeContractSnippet(themeId, brandName),
    [brandName, themeId],
  );
  const effectiveGalleryMode: Mode =
    galleryMode === 'follow' ? mode : galleryMode;

  const handleDateChange = (change: DatePickerChange) => {
    setSelectedDate(change.target.value);
  };

  const handleThemeIdFromName = (value: string) => {
    const computedId = value
      .toLowerCase()
      .trim()
      .replaceAll(/[^a-z0-9\s-]/g, '')
      .replaceAll(/\s+/g, '-')
      .replaceAll(/-+/g, '-');

    setThemeId(computedId || 'brand-theme');
  };

  const handleGenerateAiTheme = () => {
    const css = makeThemeCss(primaryHex, accentHex, tone, radius);
    setGeneratedThemeCss(css);
    setTheme('ai-brand');
    setGeneratedAt(new Date().toLocaleTimeString());
  };

  const handleExportThemeCss = () => {
    if (!generatedThemeCss) {
      return;
    }

    const safeThemeId = themeId || 'brand-theme';
    triggerTextDownload(`${safeThemeId}.css`, generatedThemeCss);
  };

  const handleExportThemeContract = () => {
    const safeThemeId = themeId || 'brand-theme';
    const contractText = `${generatedThemeContractSnippet}\n`;
    triggerTextDownload(`${safeThemeId}-theme.contract.json`, contractText);
  };

  const handleExportThemePackage = () => {
    if (!generatedThemeCss) {
      return;
    }

    const safeThemeId = themeId || 'brand-theme';
    const packageText = [
      `# ${safeThemeId} Theme Package`,
      '',
      '## src/themes file',
      `File: src/themes/${safeThemeId}.css`,
      '```css',
      generatedThemeCss,
      '```',
      '',
      '## ai/contracts theme file',
      `File: ai/contracts/themes/${safeThemeId}-theme.contract.json`,
      '```json',
      generatedThemeContractSnippet,
      '```',
      '',
      '## Commands',
      '```bash',
      buildThemeCreateCommand(safeThemeId),
      'pnpm validate:contracts',
      '```',
    ].join('\n');

    triggerTextDownload(`${safeThemeId}-theme-package.md`, packageText);
  };

  return (
    <section className="rounded-xl border border-border bg-card p-5 text-card-foreground">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {BUILT_IN_THEMES.map((builtInTheme) => (
          <Button
            key={builtInTheme.id}
            type="button"
            label={builtInTheme.label}
            variant={theme === builtInTheme.id ? 'default' : 'outline'}
            onClick={() => setTheme(builtInTheme.id)}
          />
        ))}
        <Button
          type="button"
          label="AI Brand"
          variant={theme === 'ai-brand' ? 'default' : 'outline'}
          onClick={() => setTheme('ai-brand')}
          disabled={!generatedThemeCss}
        />
        <Button
          type="button"
          label={mode === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
          variant="secondary"
          onClick={() =>
            setMode((current) => (current === 'dark' ? 'light' : 'dark'))
          }
        />
        <Chip label={`Theme: ${activeThemeLabel}`} />
      </div>

      <div className="mb-4 rounded-lg border border-border bg-background p-4">
        <h3 className="text-sm font-semibold">Theme Gallery</h3>
        <p className="mb-3 text-sm text-muted-foreground">
          Compare built-in palettes at a glance, then apply any one to the live
          preview.
        </p>
        <div className="mb-3 inline-flex items-center gap-2 rounded-md border border-border bg-card p-1">
          <Button
            type="button"
            label="Follow Active Mode"
            variant={galleryMode === 'follow' ? 'default' : 'ghost'}
            onClick={() => setGalleryMode('follow')}
          />
          <Button
            type="button"
            label="Light Swatches"
            variant={galleryMode === 'light' ? 'default' : 'ghost'}
            onClick={() => setGalleryMode('light')}
          />
          <Button
            type="button"
            label="Dark Swatches"
            variant={galleryMode === 'dark' ? 'default' : 'ghost'}
            onClick={() => setGalleryMode('dark')}
          />
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {BUILT_IN_THEMES.map((builtInTheme) => {
            const swatch =
              BUILT_IN_THEME_SWATCHES[builtInTheme.id][effectiveGalleryMode];

            return (
              <button
                key={`gallery-${builtInTheme.id}`}
                type="button"
                onClick={() => setTheme(builtInTheme.id)}
                className={`rounded-md border p-2 text-left transition ${
                  theme === builtInTheme.id
                    ? 'border-primary ring-1 ring-primary'
                    : 'border-border hover:border-primary/50'
                }`}
                style={{ backgroundColor: swatch.surface }}
              >
                <p
                  className="text-xs font-semibold"
                  style={{
                    color:
                      effectiveGalleryMode === 'light' ? '#111827' : '#e5e7eb',
                  }}
                >
                  {builtInTheme.label}
                </p>
                <div className="my-2 flex items-center gap-2">
                  <span
                    className="h-4 w-4 rounded-full border"
                    style={{
                      backgroundColor: swatch.primary,
                      borderColor: swatch.border,
                    }}
                  />
                  <span
                    className="h-4 w-4 rounded-full border"
                    style={{
                      backgroundColor: swatch.accent,
                      borderColor: swatch.border,
                    }}
                  />
                  <span
                    className="h-4 w-4 rounded-full border"
                    style={{
                      backgroundColor: swatch.surface,
                      borderColor: swatch.border,
                    }}
                  />
                </div>
                <p
                  className="text-xs"
                  style={{
                    color:
                      effectiveGalleryMode === 'light' ? '#4b5563' : '#9ca3af',
                  }}
                >
                  {BUILT_IN_THEME_SWATCHES[builtInTheme.id].note}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-4 rounded-lg border border-border bg-background p-4">
          <h3 className="text-sm font-semibold">Core Components</h3>
          <Input
            name="email"
            label="Email"
            placeholder="name@company.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <DatePicker
            name="startDate"
            label="Start date"
            value={selectedDate}
            onChange={handleDateChange}
          />
          <Search
            placeholder="Search components"
            value={searchValue}
            onChange={setSearchValue}
          />
        </div>

        <div className="space-y-4 rounded-lg border border-border bg-background p-4">
          <h3 className="text-sm font-semibold">Building Block Example</h3>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm font-medium">Team Access Review</p>
            <p className="mb-3 text-sm text-muted-foreground">
              This card uses the same semantic tokens as primitive components.
            </p>
            <div className="mb-3 flex flex-wrap gap-2">
              <Chip label="Design" />
              <Chip label="Platform" />
              <Chip label="In Review" />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="button" label="Approve" />
              <Button type="button" label="Request changes" variant="outline" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-border bg-background p-4">
        <h3 className="text-sm font-semibold">AI Theme Generator Demo</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Simulate an AI-assisted workflow: provide brand inputs, generate a
          token-complete Mezmer theme, and preview it immediately.
        </p>

        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label
              htmlFor="brand-name"
              className="mb-1 block text-xs font-medium"
            >
              Brand Name
            </label>
            <input
              id="brand-name"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={brandName}
              onChange={(event) => {
                const value = event.target.value;
                setBrandName(value);
                handleThemeIdFromName(value);
              }}
            />
          </div>
          <div>
            <label
              htmlFor="theme-id"
              className="mb-1 block text-xs font-medium"
            >
              Theme Id
            </label>
            <input
              id="theme-id"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={themeId}
              onChange={(event) => setThemeId(event.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="primary-color"
              className="mb-1 block text-xs font-medium"
            >
              Primary Color (Hex)
            </label>
            <input
              id="primary-color"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={primaryHex}
              onChange={(event) => setPrimaryHex(event.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="accent-color"
              className="mb-1 block text-xs font-medium"
            >
              Accent Color (Hex)
            </label>
            <input
              id="accent-color"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={accentHex}
              onChange={(event) => setAccentHex(event.target.value)}
            />
          </div>
          <div>
            <label htmlFor="tone" className="mb-1 block text-xs font-medium">
              Tone
            </label>
            <select
              id="tone"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={tone}
              onChange={(event) => setTone(event.target.value as BrandTone)}
            >
              <option value="balanced">Balanced</option>
              <option value="vibrant">Vibrant</option>
              <option value="executive">Executive</option>
            </select>
          </div>
          <div>
            <label htmlFor="radius" className="mb-1 block text-xs font-medium">
              Radius
            </label>
            <select
              id="radius"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={radius}
              onChange={(event) => setRadius(event.target.value)}
            >
              <option value="0.5rem">0.5rem</option>
              <option value="0.625rem">0.625rem</option>
              <option value="0.75rem">0.75rem</option>
              <option value="1rem">1rem</option>
            </select>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <Button
            type="button"
            label="Generate AI Theme"
            onClick={handleGenerateAiTheme}
          />
          <Button
            type="button"
            label="Apply Generated Theme"
            variant="outline"
            onClick={() => setTheme('ai-brand')}
            disabled={!generatedThemeCss}
          />
          <Button
            type="button"
            label="Export CSS"
            variant="outline"
            onClick={handleExportThemeCss}
            disabled={!generatedThemeCss}
          />
          <Button
            type="button"
            label="Export Contract"
            variant="outline"
            onClick={handleExportThemeContract}
          />
          <Button
            type="button"
            label="Export Theme Package"
            variant="outline"
            onClick={handleExportThemePackage}
            disabled={!generatedThemeCss}
          />
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <div className="rounded-md border border-border bg-card p-3">
            <p className="mb-2 text-xs font-semibold">CLI Command</p>
            <pre className="overflow-x-auto text-xs text-muted-foreground">
              {generatedThemeCommand}
            </pre>
          </div>
          <div className="rounded-md border border-border bg-card p-3">
            <p className="mb-2 text-xs font-semibold">Contract Snippet</p>
            <pre className="max-h-36 overflow-auto text-xs text-muted-foreground">
              {generatedThemeContractSnippet}
            </pre>
          </div>
        </div>

        <div className="mt-3 rounded-md border border-border bg-card p-3">
          <p className="mb-2 text-xs font-semibold">Generated Theme CSS</p>
          <pre className="max-h-48 overflow-auto text-xs text-muted-foreground">
            {generatedThemeCss ?? 'Generate a theme to see the token output.'}
          </pre>
        </div>

        {generatedAt ? (
          <p className="mt-2 text-xs text-muted-foreground">
            Generated at {generatedAt}. The preview now uses your generated
            token set.
          </p>
        ) : null}
      </div>
    </section>
  );
}
