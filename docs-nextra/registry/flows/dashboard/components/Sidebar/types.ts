import type { ReactNode } from 'react';
import type { LayoutDashboard } from 'lucide-react';
import type { ViewEditAccessConfig } from '@rapidset/rapidkit';

export type DashboardNavItem = {
  key: string;
  label: string;
  icon: typeof LayoutDashboard;
  group: string;
  access?: ViewEditAccessConfig;
  items?: ReadonlyArray<{
    key: string;
    label: string;
    access?: ViewEditAccessConfig;
  }>;
};

export type SidebarProps = Readonly<{
  activeNav: string;
  onSelectNav: (key: string) => void;
  mainContent: ReactNode;
}>;
