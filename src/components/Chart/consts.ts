import type { CSSProperties } from 'react';

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

export const CHART_DEFAULT_CONTAINER_STYLE: CSSProperties = {
  width: '100%',
};

export const CHART_DEFAULT_PIE_INNER_RADIUS = 0;
export const CHART_DEFAULT_PIE_OUTER_RADIUS = 90;
export const CHART_DEFAULT_BAR_RADIUS = 4;
export const CHART_DEFAULT_STACK_ID = 'rk-chart-stack';
export const CHART_VERTICAL_Y_AXIS_WIDTH = 80;
export const CHART_AXIS_TICK_MARGIN = 8;

export const CHART_GRID_STROKE_DASHARRAY = '3 3';
export const CHART_LINE_STROKE_WIDTH = 2;
export const CHART_ACTIVE_DOT_RADIUS = 4;
export const CHART_AREA_FILL_OPACITY = 0.25;
export const CHART_DEFAULT_LEGEND_PLACEMENT = 'bottom';
export const CHART_DEFAULT_LAYOUT = 'horizontal';
export const CHART_EMPTY_STATE_TEXT = 'No data to display';
export const CHART_EMPTY_STATE_LABEL = 'Empty chart';
