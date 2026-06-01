import { StatCard } from '@rapidset/rapidkit';
import { DASHBOARD_KPIS } from './data';
import type { KpiTilesProps } from './types';

export function KpiTiles({ focusedKpi, onFocusKpi }: KpiTilesProps) {
  return (
    <section className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
      {DASHBOARD_KPIS.map((kpi) => (
        <StatCard
          key={kpi.key}
          label={kpi.label}
          value={kpi.value}
          icon={kpi.icon}
          delta={kpi.delta}
          trend={kpi.trend}
          description={focusedKpi === kpi.key ? 'Selected' : undefined}
          onClick={() => onFocusKpi(kpi.key)}
          className={
            focusedKpi === kpi.key
              ? 'shadow-sm ring-2 ring-primary/30'
              : 'shadow-sm'
          }
        />
      ))}
    </section>
  );
}
