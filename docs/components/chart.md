# Chart

## Purpose

Theme-aware chart wrapper with line, bar, area, and pie variants. Built on Recharts under the hood, driven by a config object that maps each data key to its label and color so tooltips and legends stay in sync. Supports injectable view access control, empty-state rendering, and standard tooltip/legend/grid toggles.

## Import

```tsx
import { Chart, ChartVariant } from '@rapidset/rapidkit';
import type { ChartConfig } from '@rapidset/rapidkit';
```

<ComponentExampleTabs component="chart" />

## Basic Usage

```tsx
const data = [
  { month: 'Jan', revenue: 12000, cost: 8000 },
  { month: 'Feb', revenue: 18500, cost: 11000 },
  { month: 'Mar', revenue: 22100, cost: 13400 },
];

const config: ChartConfig = {
  revenue: { label: 'Revenue', color: 'hsl(var(--primary))' },
  cost: { label: 'Cost', color: 'hsl(var(--destructive))' },
};

<Chart
  type={ChartVariant.Line}
  data={data}
  config={config}
  series={[{ dataKey: 'revenue' }, { dataKey: 'cost' }]}
  xAxisKey="month"
  smooth
  showDots
/>;
```

## Common Props

- `type: ChartVariant` — `Line`, `Bar`, `Area`, or `Pie`.
- `data: ChartDatum[]` — array of row objects keyed by `xAxisKey` and series `dataKey`s.
- `config: ChartConfig` — map of data key to `{ label, color }` used by tooltip and legend.
- `series: ChartSeries[]` — required for `Line`, `Bar`, `Area`. Each `{ dataKey, color?, stackId?, hidden? }`.
- `xAxisKey: string` — required for `Line`, `Bar`, `Area`.
- `dataKey: string`, `nameKey: string` — required for `Pie`.
- `height?: number | string` — explicit container height; falls back to the chart's intrinsic `aspect-video` ratio.
- `showTooltip?: boolean` (default `true`), `showLegend?: boolean` (default `true`), `legendPlacement?: 'top' | 'bottom'`.
- `showGrid?: boolean`, `showXAxis?: boolean`, `showYAxis?: boolean` — cartesian variants only.
- `stacked?: boolean`, `layout?: 'horizontal' | 'vertical'` — `Bar` and `Area`.
- `smooth?: boolean`, `showDots?: boolean` — `Line` and `Area`.
- `barRadius?: number` — `Bar` only.
- `innerRadius?: number`, `outerRadius?: number` — `Pie` only (set `innerRadius` for a donut).
- `emptyState?: ReactNode` — custom node rendered when `data.length === 0`.
- `className?: string`.
- `access?: ChartAccessConfig`, `canAccess?: ChartAccessResolver`.

## Variants

- `ChartVariant.Line` — series rendered as lines. Pair with `smooth` for monotone interpolation and `showDots` for data point markers.
- `ChartVariant.Bar` — grouped or stacked bars. `layout="vertical"` flips the orientation. `barRadius` controls corner radius.
- `ChartVariant.Area` — filled curves. Honors `stacked` and `smooth`.
- `ChartVariant.Pie` — slice per row. `innerRadius > 0` produces a donut.

## Accessibility

- The chart container is exposed with `role="img"` and an `aria-label` that names the variant (e.g. `"line chart"`).
- The empty state uses `role="img"` with `aria-label="Empty chart"` so it remains discoverable.
- Tooltips and legends inherit Recharts' default keyboard behavior; assistive technologies are expected to read the underlying data through accompanying tables when precise values matter.

## Theming

- Colors flow through the `config` prop: each entry's `color` is exposed inside the chart as `var(--color-<dataKey>)`, so tooltips, legends, and series stay aligned with the active RapidKit theme.
- Omit `color` to fall back to a built-in five-step palette derived from `--primary`, `--accent-foreground`, `--muted-foreground`, `--destructive`, and `--secondary-foreground`.
- All grid lines, axes, and tooltip surfaces use the package's semantic tokens (`--border`, `--card`, `--muted-foreground`), so swapping themes updates the chart without code changes.

## Access Control

- No resolver or no rules: chart remains visible.
- All listed view rules must pass by default (`access.match` defaults to `'all'`).
- View denied: component returns `null`.
- For provider inheritance and CASL adapter examples, see [Access Control](../ACCESS_CONTROL.md).
