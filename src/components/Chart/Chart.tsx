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
} from '@ui/chart';
import {
  buildResolvedConfig,
  isCartesianProps,
  resolveChartAccessState,
} from './helpers';
import {
  CHART_ACTIVE_DOT_RADIUS,
  CHART_AREA_FILL_OPACITY,
  CHART_AXIS_TICK_MARGIN,
  CHART_DEFAULT_BAR_RADIUS,
  CHART_DEFAULT_CONTAINER_STYLE,
  CHART_DEFAULT_LAYOUT,
  CHART_DEFAULT_LEGEND_PLACEMENT,
  CHART_DEFAULT_PIE_INNER_RADIUS,
  CHART_DEFAULT_PIE_OUTER_RADIUS,
  CHART_DEFAULT_STACK_ID,
  CHART_EMPTY_STATE_LABEL,
  CHART_EMPTY_STATE_TEXT,
  CHART_GRID_STROKE_DASHARRAY,
  CHART_LINE_STROKE_WIDTH,
  CHART_VERTICAL_Y_AXIS_WIDTH,
  ChartVariant,
} from './consts';
import type {
  ChartAreaProps,
  ChartBarProps,
  ChartCartesianProps,
  ChartCommonProps,
  ChartLineProps,
  ChartPieProps,
  ChartProps,
} from './types';

const buildSeriesElements = (
  props: ChartLineProps | ChartBarProps | ChartAreaProps,
) => {
  const { series, stacked, type } = props;

  return series
    .filter((entry) => !entry.hidden)
    .map((entry) => {
      const color = entry.color ?? `var(--color-${entry.dataKey})`;
      const stackId = stacked
        ? (entry.stackId ?? CHART_DEFAULT_STACK_ID)
        : entry.stackId;

      if (type === ChartVariant.Line) {
        const lineProps = props as ChartLineProps;
        return (
          <Line
            key={entry.dataKey}
            type={lineProps.smooth ? 'monotone' : 'linear'}
            dataKey={entry.dataKey}
            stroke={color}
            strokeWidth={CHART_LINE_STROKE_WIDTH}
            dot={lineProps.showDots ?? false}
            activeDot={{ r: CHART_ACTIVE_DOT_RADIUS }}
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
            radius={barProps.barRadius ?? CHART_DEFAULT_BAR_RADIUS}
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
          fillOpacity={CHART_AREA_FILL_OPACITY}
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
    legendPlacement = CHART_DEFAULT_LEGEND_PLACEMENT,
    layout = CHART_DEFAULT_LAYOUT,
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
    <CartesianGrid
      strokeDasharray={CHART_GRID_STROKE_DASHARRAY}
      vertical={isVertical}
    />
  ) : null;

  const xAxisProps: Record<string, unknown> = {
    tickLine: false,
    axisLine: false,
    tickMargin: CHART_AXIS_TICK_MARGIN,
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
    tickMargin: CHART_AXIS_TICK_MARGIN,
  };
  if (isVertical) {
    yAxisProps.dataKey = xAxisKey;
    yAxisProps.type = 'category';
    yAxisProps.width = CHART_VERTICAL_Y_AXIS_WIDTH;
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
    legendPlacement = CHART_DEFAULT_LEGEND_PLACEMENT,
    innerRadius = CHART_DEFAULT_PIE_INNER_RADIUS,
    outerRadius = CHART_DEFAULT_PIE_OUTER_RADIUS,
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
        aria-label={CHART_EMPTY_STATE_LABEL}
        className={cn(
          'flex aspect-video items-center justify-center rounded-md border border-dashed border-border bg-card text-sm text-muted-foreground',
          className,
        )}
        style={
          height
            ? { ...CHART_DEFAULT_CONTAINER_STYLE, height }
            : CHART_DEFAULT_CONTAINER_STYLE
        }
      >
        {emptyState ?? CHART_EMPTY_STATE_TEXT}
      </div>
    );
  }

  const containerStyle: CSSProperties = height
    ? { ...CHART_DEFAULT_CONTAINER_STYLE, height }
    : CHART_DEFAULT_CONTAINER_STYLE;

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
