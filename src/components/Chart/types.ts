import type { ReactNode } from 'react';
import type {
  AccessConfig,
  AccessMatch,
  AccessResolver,
  AccessRule,
} from '@lib/access-types';
import type { ChartConfig } from '@ui/chart';
import type { ChartVariant } from './styles';

export type ChartAccessMode = 'view';
export type ChartAccessMatch = AccessMatch;
export type ChartAccessRule = AccessRule<ChartAccessMode>;
export type ChartAccessConfig = AccessConfig<ChartAccessMode>;
export type ChartAccessResolver = AccessResolver<
  ChartAccessMode,
  ChartAccessRule
>;

export type ChartDatum = Record<string, unknown>;

export type ChartSeries = Readonly<{
  dataKey: string;
  color?: string;
  stackId?: string;
  hidden?: boolean;
}>;

export type ChartLayout = 'horizontal' | 'vertical';

export type ChartLegendPlacement = 'top' | 'bottom';

export type ChartCommonProps = Readonly<{
  data: readonly ChartDatum[];
  config: ChartConfig;
  className?: string;
  height?: number | string;
  emptyState?: ReactNode;
  showTooltip?: boolean;
  showLegend?: boolean;
  legendPlacement?: ChartLegendPlacement;
  access?: ChartAccessConfig;
  canAccess?: ChartAccessResolver;
}>;

export type ChartCartesianProps = ChartCommonProps &
  Readonly<{
    series: readonly ChartSeries[];
    xAxisKey: string;
    showGrid?: boolean;
    showXAxis?: boolean;
    showYAxis?: boolean;
    stacked?: boolean;
    layout?: ChartLayout;
  }>;

export type ChartLineProps = ChartCartesianProps &
  Readonly<{
    type: ChartVariant.Line;
    smooth?: boolean;
    showDots?: boolean;
  }>;

export type ChartBarProps = ChartCartesianProps &
  Readonly<{
    type: ChartVariant.Bar;
    barRadius?: number;
  }>;

export type ChartAreaProps = ChartCartesianProps &
  Readonly<{
    type: ChartVariant.Area;
    smooth?: boolean;
  }>;

export type ChartPieProps = ChartCommonProps &
  Readonly<{
    type: ChartVariant.Pie;
    dataKey: string;
    nameKey: string;
    innerRadius?: number;
    outerRadius?: number;
  }>;

export type ChartProps =
  | ChartLineProps
  | ChartBarProps
  | ChartAreaProps
  | ChartPieProps;

export type { ChartConfig } from '@ui/chart';
