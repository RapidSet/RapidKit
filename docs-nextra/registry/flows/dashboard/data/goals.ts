import type { DashboardGoal } from '../types';

export const DASHBOARD_GOALS: DashboardGoal[] = [
  {
    key: 'mrr',
    label: 'Monthly recurring revenue',
    current: 68000,
    target: 80000,
    unit: '$',
  },
  {
    key: 'qsignups',
    label: 'Quarterly sign-ups',
    current: 5420,
    target: 7500,
    unit: '',
  },
  { key: 'csat', label: 'CSAT score', current: 84, target: 90, unit: '%' },
];
