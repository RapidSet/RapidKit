import type { Users } from 'lucide-react';
import type { StatCardTrend } from '@rapidset/rapidkit';

export type DashboardKpi = {
  key: string;
  label: string;
  value: string;
  delta: string;
  trend: StatCardTrend;
  icon: typeof Users;
};

export type KpiTilesProps = Readonly<{
  focusedKpi: string | null;
  onFocusKpi: (key: string) => void;
}>;
