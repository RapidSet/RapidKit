export enum ChartVariant {
  Line = 'line',
  Bar = 'bar',
  Area = 'area',
  Pie = 'pie',
}

/**
 * Five-step theme-aware palette used when a series has no `color` in its
 * config entry. These map to RapidKit's `--rk-chart-1..5` tokens (defined
 * in `src/styles.css` for both light and dark) so charts re-skin with the
 * active theme. Each value is fed through Shadcn's `ChartStyle` block as a
 * `--color-<key>` CSS variable, so the nested `var(...)` inside `hsl(...)`
 * resolves at paint time rather than at SVG attribute parse time.
 */
export const CHART_DEFAULT_PALETTE: readonly string[] = [
  'hsl(var(--rk-chart-1))',
  'hsl(var(--rk-chart-2))',
  'hsl(var(--rk-chart-3))',
  'hsl(var(--rk-chart-4))',
  'hsl(var(--rk-chart-5))',
] as const;
