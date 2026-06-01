import { Activity, DollarSign, TrendingUp, Users } from 'lucide-react';
import type { DashboardKpi } from './types';

export const DASHBOARD_KPIS: DashboardKpi[] = [
  {
    key: 'users',
    label: 'Active users',
    value: '24,318',
    delta: '+12.4%',
    trend: 'up',
    icon: Users,
  },
  {
    key: 'revenue',
    label: 'Revenue',
    value: '$84,210',
    delta: '+8.1%',
    trend: 'up',
    icon: DollarSign,
  },
  {
    key: 'conversion',
    label: 'Conversion rate',
    value: '3.42%',
    delta: '-0.6%',
    trend: 'down',
    icon: TrendingUp,
  },
  {
    key: 'sessions',
    label: 'Sessions',
    value: '109,884',
    delta: '+4.7%',
    trend: 'up',
    icon: Activity,
  },
];
