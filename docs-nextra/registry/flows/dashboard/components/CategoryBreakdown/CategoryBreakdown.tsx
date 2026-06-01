import { Globe2 } from 'lucide-react';
import { Chart, ChartVariant, Text } from '@rapidset/rapidkit';
import { DASHBOARD_TRAFFIC_CONFIG, DASHBOARD_TRAFFIC_SOURCES } from './data';

export function CategoryBreakdown() {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <Globe2 className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        <Text as="p" className="text-sm font-medium text-foreground">
          Traffic sources
        </Text>
      </div>
      <Chart
        type={ChartVariant.Pie}
        data={DASHBOARD_TRAFFIC_SOURCES}
        config={DASHBOARD_TRAFFIC_CONFIG}
        dataKey="visits"
        nameKey="source"
        height={240}
        legendPlacement="bottom"
      />
    </div>
  );
}
