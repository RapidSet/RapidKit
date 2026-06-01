import type { ChartConfig } from '@rapidset/rapidkit';

export const DASHBOARD_CHANNELS = [
  { channel: 'Search', conversions: 1240 },
  { channel: 'Social', conversions: 980 },
  { channel: 'Email', conversions: 780 },
  { channel: 'Direct', conversions: 540 },
  { channel: 'Partners', conversions: 320 },
];

export const DASHBOARD_CHANNELS_CONFIG: ChartConfig = {
  conversions: { label: 'Conversions' },
};
