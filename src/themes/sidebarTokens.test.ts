import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const SIDEBAR_TOKENS = [
  '--rk-sidebar-background',
  '--rk-sidebar-foreground',
  '--rk-sidebar-primary',
  '--rk-sidebar-primary-foreground',
  '--rk-sidebar-accent',
  '--rk-sidebar-accent-foreground',
  '--rk-sidebar-border',
  '--rk-sidebar-ring',
] as const;

const readCss = (relativePath: string) =>
  fs.readFileSync(path.resolve(process.cwd(), relativePath), 'utf8');

const extractBlock = (css: string, selector: string) => {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = css.match(new RegExp(`${escaped}\\s*\\{([^}]*)\\}`, 'm'));
  return match?.[1] ?? '';
};

describe('Sidebar token surface', () => {
  it('declares default --rk-sidebar-* mappings in styles.css', () => {
    const styles = readCss('src/styles.css');
    const rootBlock = extractBlock(styles, ':root');

    SIDEBAR_TOKENS.forEach((token) => {
      expect(rootBlock).toContain(token);
    });

    expect(rootBlock).toContain(
      '--sidebar-background: var(--rk-sidebar-background)',
    );
    expect(rootBlock).toContain('--sidebar-accent: var(--rk-sidebar-accent)');
  });

  it('monday theme overrides --rk-sidebar-background to the neutral cool-gray tint (#f5f6f8)', () => {
    const monday = readCss('src/themes/monday.css');
    const rootBlock = extractBlock(monday, ':root');
    const darkBlock = extractBlock(monday, '.dark');

    SIDEBAR_TOKENS.forEach((token) => {
      expect(rootBlock).toContain(token);
      expect(darkBlock).toContain(token);
    });

    const bgMatch = rootBlock.match(
      /--rk-sidebar-background:\s*(\d+)\s+(\d+)%\s+(\d+)%/,
    );
    expect(
      bgMatch,
      'monday --rk-sidebar-background must be a HSL triplet',
    ).not.toBeNull();
    const [, hue, sat, light] = bgMatch ?? [];
    // monday.com sidebar is #f5f6f8 — a cool neutral gray (hue ~210-230,
    // very low saturation, near-white lightness). Not a tinted accent surface.
    expect(Number(hue)).toBeGreaterThanOrEqual(210);
    expect(Number(hue)).toBeLessThanOrEqual(230);
    expect(Number(sat)).toBeLessThanOrEqual(20);
    expect(Number(light)).toBeGreaterThanOrEqual(94);
  });
});
