import {
  BarChart3,
  Bell,
  LayoutDashboard,
  Settings,
  Target,
  Users,
} from 'lucide-react';
import type { DashboardNavItem } from './types';

export const DASHBOARD_NAV: ReadonlyArray<DashboardNavItem> = [
  {
    key: 'overview',
    label: 'Overview',
    icon: LayoutDashboard,
    group: 'Workspace',
  },
  {
    key: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    group: 'Workspace',
    items: [
      { key: 'analytics.acquisition', label: 'Acquisition' },
      { key: 'analytics.engagement', label: 'Engagement' },
      { key: 'analytics.retention', label: 'Retention' },
    ],
  },
  { key: 'audiences', label: 'Audiences', icon: Users, group: 'Audience' },
  {
    key: 'campaigns',
    label: 'Campaigns',
    icon: Target,
    group: 'Audience',
    items: [
      { key: 'campaigns.active', label: 'Active' },
      { key: 'campaigns.drafts', label: 'Drafts' },
      { key: 'campaigns.archive', label: 'Archive' },
    ],
  },
  { key: 'alerts', label: 'Alerts', icon: Bell, group: 'System' },
  {
    key: 'settings',
    label: 'Settings',
    icon: Settings,
    group: 'System',
    access: { rules: [{ action: 'read', subject: 'settings' }] },
    items: [
      { key: 'settings.profile', label: 'Profile' },
      { key: 'settings.team', label: 'Team' },
      {
        key: 'settings.billing',
        label: 'Billing',
        access: { rules: [{ action: 'read', subject: 'finance' }] },
      },
    ],
  },
];
