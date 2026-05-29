import { forwardRef, useMemo, type CSSProperties } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from 'recharts';
import { useAccessResolver } from '@lib/use-access-resolver';
import { cn } from '@lib/utils';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@ui/chart';
import { resolveChartAccessState } from './helpers';
import { CHART_DEFAULT_PALETTE, ChartVariant } from './styles';
import type {
  ChartAreaProps,
  ChartBarProps,
  ChartCartesianProps,
  ChartCommonProps,
  ChartLineProps,
  ChartPieProps,
  ChartProps,
} from './types';

const DEFAULT_STYLE: CSSProperties = { width: '100%' };

const isCartesianProps = (
  props: ChartProps,
): props is ChartLineProps | ChartBarProps | ChartAreaProps =>
  props.type === ChartVariant.Line ||
  props.type === ChartVariant.Bar ||
  props.type === ChartVariant.Area;

const hasConfigColor = (config: ChartConfig, key: string): boolean => {
  const entry = config[key];
  if (!entry) {
    return false;
  }
  if ('color' in entry && entry.color) {
    return true;
  }
  return 'theme' in entry && Boolean(entry.theme);
};

const resolveFallbackColor = (index: number): string =>
  CHART_DEFAULT_PALETTE[index % CHART_DEFAULT_PALETTE.length] ?? '';

/**
 * Build a config that guarantees a `color` for every key the chart will
 * render. Shadcn's `ChartStyle` emits `--color-<key>` only for entries that
 * have a `color` or `theme` set, and chart SVG paint attributes can only
 * resolve `var(--color-<key>)` (not nested `hsl(var(--*))` chains). So we
 * fill in fallback palette colors for any series/slice without one before
 * handing the config to `ChartContainer`.
 */
const buildResolvedConfig = (
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

const buildSeriesElements = (
  props: ChartLineProps | ChartBarProps | ChartAreaProps,
) => {
  const { series, stacked, type } = props;

  return series
    .filter((entry) => !entry.hidden)
    .map((entry) => {
      const color = entry.color ?? `var(--color-${entry.dataKey})`;
      const stackId = stacked
        ? (entry.stackId ?? 'rk-chart-stack')
        : entry.stackId;

      if (type === ChartVariant.Line) {
        const lineProps = props as ChartLineProps;
        return (
          <Line
            key={entry.dataKey}
            type={lineProps.smooth ? 'monotone' : 'linear'}
            dataKey={entry.dataKey}
            stroke={color}
            strokeWidth={2}
            dot={lineProps.showDots ?? false}
            activeDot={{ r: 4 }}
            isAnimationActive={false}
          />
        );
      }

      if (type === ChartVariant.Bar) {
        const barProps = props as ChartBarProps;
        return (
          <Bar
            key={entry.dataKey}
            dataKey={entry.dataKey}
            fill={color}
            radius={barProps.barRadius ?? 4}
            stackId={stackId}
            isAnimationActive={false}
          />
        );
      }

      const areaProps = props as ChartAreaProps;
      return (
        <Area
          key={entry.dataKey}
          type={areaProps.smooth ? 'monotone' : 'linear'}
          dataKey={entry.dataKey}
          stroke={color}
          fill={color}
          fillOpacity={0.25}
          stackId={stackId}
          isAnimationActive={false}
        />
      );
    });
};

const renderCartesianChart = (
  props: ChartLineProps | ChartBarProps | ChartAreaProps,
) => {
  const {
    data,
    xAxisKey,
    showGrid = true,
    showXAxis = true,
    showYAxis = true,
    showTooltip = true,
    showLegend = true,
    legendPlacement = 'bottom',
    layout = 'horizontal',
    type,
  } = props as ChartCartesianProps & { type: ChartVariant };

  const seriesElements = buildSeriesElements(props);
  const mutableData =
    data as ChartCartesianProps['data'] extends readonly (infer U)[]
      ? U[]
      : never;

  // Children must be passed as inline JSX siblings (not a single array
  // expression). Recharts uses React.Children.forEach to discover XAxis,
  // YAxis, CartesianGrid, Area, etc. and reads positional metadata from
  // each child; passing an array literal as a single child breaks that
  // discovery for some children (CartesianGrid + YAxis silently drop out
  // while Area + XAxis survive).

  const isVertical = layout === 'vertical';

  const grid = showGrid ? (
    <CartesianGrid strokeDasharray="3 3" vertical={isVertical} />
  ) : null;

  const xAxisProps: Record<string, unknown> = {
    tickLine: false,
    axisLine: false,
    tickMargin: 8,
  };
  if (isVertical) {
    xAxisProps.type = 'number';
  } else {
    xAxisProps.dataKey = xAxisKey;
  }
  const xAxis = showXAxis ? <XAxis {...xAxisProps} /> : null;

  const yAxisProps: Record<string, unknown> = {
    tickLine: false,
    axisLine: false,
    tickMargin: 8,
  };
  if (isVertical) {
    yAxisProps.dataKey = xAxisKey;
    yAxisProps.type = 'category';
    yAxisProps.width = 80;
  }
  const yAxis = showYAxis ? <YAxis {...yAxisProps} /> : null;

  const tooltip = showTooltip ? (
    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
  ) : null;

  const legend = showLegend ? (
    <ChartLegend
      verticalAlign={legendPlacement}
      content={<ChartLegendContent />}
    />
  ) : null;

  if (type === ChartVariant.Line) {
    return (
      <LineChart data={mutableData} layout={layout}>
        {grid}
        {xAxis}
        {yAxis}
        {tooltip}
        {legend}
        {seriesElements}
      </LineChart>
    );
  }

  if (type === ChartVariant.Bar) {
    return (
      <BarChart data={mutableData} layout={layout}>
        {grid}
        {xAxis}
        {yAxis}
        {tooltip}
        {legend}
        {seriesElements}
      </BarChart>
    );
  }

  return (
    <AreaChart data={mutableData} layout={layout}>
      {grid}
      {xAxis}
      {yAxis}
      {tooltip}
      {legend}
      {seriesElements}
    </AreaChart>
  );
};

const renderPieChart = (props: ChartPieProps) => {
  const {
    data,
    dataKey,
    nameKey,
    showTooltip = true,
    showLegend = true,
    legendPlacement = 'bottom',
    innerRadius = 0,
    outerRadius = 90,
  } = props;

  return (
    <PieChart>
      {showTooltip ? (
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent nameKey={nameKey} hideLabel />}
        />
      ) : null}
      <Pie
        data={
          data as ChartPieProps['data'] extends readonly (infer U)[]
            ? U[]
            : never
        }
        dataKey={dataKey}
        nameKey={nameKey}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        isAnimationActive={false}
      >
        {data.map((datum, index) => {
          const key = String(
            (datum as Record<string, unknown>)[nameKey] ?? index,
          );
          return <Cell key={`${key}-${index}`} fill={`var(--color-${key})`} />;
        })}
      </Pie>
      {showLegend ? (
        <ChartLegend
          verticalAlign={legendPlacement}
          content={<ChartLegendContent nameKey={nameKey} />}
        />
      ) : null}
    </PieChart>
  );
};

export const Chart = forwardRef<HTMLDivElement, ChartProps>((props, ref) => {
  const { config, className, height, emptyState, access, canAccess, data } =
    props as ChartCommonProps;

  const resolvedCanAccess = useAccessResolver(canAccess);
  const { canView } = resolveChartAccessState(access, resolvedCanAccess);

  // Enumerate every key that will need a color slot so we can prefill
  // fallback palette entries for any series/slice the caller didn't color.
  const colorKeys = useMemo(() => {
    if (props.type === ChartVariant.Pie) {
      const { data: pieData, nameKey } = props;
      return pieData.map((datum) =>
        String((datum as Record<string, unknown>)[nameKey] ?? ''),
      );
    }
    return props.series.map((entry) => entry.dataKey);
  }, [props]);

  const resolvedConfig = useMemo(
    () => buildResolvedConfig(config, colorKeys),
    [config, colorKeys],
  );

  if (!canView) {
    return null;
  }

  if (!data.length) {
    return (
      <div
        ref={ref}
        role="img"
        aria-label="Empty chart"
        className={cn(
          'flex aspect-video items-center justify-center rounded-md border border-dashed border-border bg-card text-sm text-muted-foreground',
          className,
        )}
        style={height ? { ...DEFAULT_STYLE, height } : DEFAULT_STYLE}
      >
        {emptyState ?? 'No data to display'}
      </div>
    );
  }

  const containerStyle: CSSProperties = height
    ? { ...DEFAULT_STYLE, height }
    : DEFAULT_STYLE;

  // Pass the resolved (color-filled) config through to nested renderers so
  // tooltips, legends, and series resolve the same fallback colors.
  const chartProps = { ...props, config: resolvedConfig } as ChartProps;
  const chartElement = isCartesianProps(chartProps)
    ? renderCartesianChart(chartProps)
    : renderPieChart(chartProps);

  return (
    <ChartContainer
      ref={ref}
      config={resolvedConfig}
      className={cn('w-full', className)}
      style={containerStyle}
      role="img"
      aria-label={`${props.type} chart`}
    >
      {chartElement}
    </ChartContainer>
  );
});

Chart.displayName = 'Chart';
