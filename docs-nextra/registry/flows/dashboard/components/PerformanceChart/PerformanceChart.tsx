import { useMemo } from 'react';
import { LineChart } from 'lucide-react';
import { Chart, ChartVariant, Chip, Text } from '@rapidset/rapidkit';
import {
  DASHBOARD_SESSIONS_30D,
  DASHBOARD_SESSIONS_7D,
  DASHBOARD_SESSIONS_CONFIG,
} from './data';
import type { PerformanceChartProps } from './types';

export function PerformanceChart({
  dateRange,
  dateRangeLabel,
}: PerformanceChartProps) {
  const sessionsData = useMemo(
    () =>
      dateRange === '30d' ? DASHBOARD_SESSIONS_30D : DASHBOARD_SESSIONS_7D,
    [dateRange],
  );

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm lg:col-span-2">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LineChart
            className="h-4 w-4 text-muted-foreground"
            aria-hidden="true"
          />
          <Text as="p" className="text-sm font-medium text-foreground">
            Sessions & sign-ups
          </Text>
        </div>
        <Chip
          label={dateRangeLabel}
          variant="outline"
          size="sm"
          className="border-border bg-muted text-muted-foreground"
        />
      </div>
      <Chart
        type={ChartVariant.Area}
        data={sessionsData}
        config={DASHBOARD_SESSIONS_CONFIG}
        series={[{ dataKey: 'sessions' }, { dataKey: 'signups' }]}
        xAxisKey="day"
        stacked
        smooth
        height={240}
        legendPlacement="bottom"
      />
    </div>
  );
}
