import type { ChartConfig } from '@rapidset/rapidkit';

export const DASHBOARD_TRAFFIC_SOURCES = [
  { source: 'Organic', visits: 4280 },
  { source: 'Referral', visits: 2190 },
  { source: 'Paid', visits: 1840 },
  { source: 'Email', visits: 1320 },
  { source: 'Social', visits: 980 },
];

export const DASHBOARD_TRAFFIC_CONFIG: ChartConfig = {
  Organic: { label: 'Organic' },
  Referral: { label: 'Referral' },
  Paid: { label: 'Paid' },
  Email: { label: 'Email' },
  Social: { label: 'Social' },
};
