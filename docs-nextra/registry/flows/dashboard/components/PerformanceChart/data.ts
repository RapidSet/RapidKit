import type { ChartConfig } from '@rapidset/rapidkit';

export const DASHBOARD_SESSIONS_7D = [
  { day: 'Mon', sessions: 12400, signups: 480 },
  { day: 'Tue', sessions: 13280, signups: 512 },
  { day: 'Wed', sessions: 14820, signups: 575 },
  { day: 'Thu', sessions: 15960, signups: 612 },
  { day: 'Fri', sessions: 17120, signups: 698 },
  { day: 'Sat', sessions: 13740, signups: 540 },
  { day: 'Sun', sessions: 12290, signups: 470 },
];

export const DASHBOARD_SESSIONS_30D = [
  { day: 'W1', sessions: 84200, signups: 3120 },
  { day: 'W2', sessions: 91440, signups: 3478 },
  { day: 'W3', sessions: 98820, signups: 3712 },
  { day: 'W4', sessions: 102310, signups: 3940 },
];

export const DASHBOARD_SESSIONS_CONFIG: ChartConfig = {
  sessions: { label: 'Sessions' },
  signups: { label: 'Sign-ups' },
};
