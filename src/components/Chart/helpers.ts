import { resolveViewAccessState } from '@lib/view-edit-access';
import type { ChartConfig } from '@ui/chart';
import { CHART_DEFAULT_PALETTE, ChartVariant } from './consts';
import type {
  ChartAccessConfig,
  ChartAccessResolver,
  ChartAreaProps,
  ChartBarProps,
  ChartLineProps,
  ChartProps,
} from './types';

export const resolveChartAccessState = (
  access: ChartAccessConfig | undefined,
  canAccess: ChartAccessResolver | undefined,
) => resolveViewAccessState(access, canAccess);

export const isCartesianProps = (
  props: ChartProps,
): props is ChartLineProps | ChartBarProps | ChartAreaProps =>
  props.type === ChartVariant.Line ||
  props.type === ChartVariant.Bar ||
  props.type === ChartVariant.Area;

export const hasConfigColor = (config: ChartConfig, key: string): boolean => {
  const entry = config[key];
  if (!entry) {
    return false;
  }
  if ('color' in entry && entry.color) {
    return true;
  }
  return 'theme' in entry && Boolean(entry.theme);
};

export const resolveFallbackColor = (index: number): string =>
  CHART_DEFAULT_PALETTE[index % CHART_DEFAULT_PALETTE.length] ?? '';

/**
 * Build a config that guarantees a `color` for every key the chart will
 * render. Shadcn's `ChartStyle` emits `--color-<key>` only for entries that
 * have a `color` or `theme` set, and chart SVG paint attributes cannot
 * resolve nested `hsl(var(--*))` chains — only flat `var(--color-<key>)`
 * references work. So we fill in fallback palette colors for any
 * series/slice the caller didn't color before handing the config to
 * `ChartContainer`.
 */
export const buildResolvedConfig = (
  config: ChartConfig,
  keys: readonly string[],
): ChartConfig => {
  const next: ChartConfig = { ...config };
  let fallbackIndex = 0;
  keys.forEach((key) => {
    if (hasConfigColor(next, key)) {
      return;
    }
    const existing = next[key];
    // hasConfigColor returned false, so existing has no color and no theme;
    // the `color`-branch of the discriminated union is the safe target.
    next[key] = {
      label: existing?.label,
      icon: existing?.icon,
      color: resolveFallbackColor(fallbackIndex),
    } as ChartConfig[string];
    fallbackIndex += 1;
  });
  return next;
};
