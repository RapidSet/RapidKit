import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import type {
  AccessConfig,
  AccessMatch,
  AccessResolver,
  AccessRule,
} from '@lib/access-types';

export type StatCardTrend = 'up' | 'down' | 'neutral';

export type StatCardAccessMode = 'view' | 'edit';

export type StatCardAccessMatch = AccessMatch;

export type StatCardAccessRule = AccessRule<StatCardAccessMode>;

export type StatCardAccessConfig = AccessConfig<StatCardAccessMode>;

export type StatCardAccessResolver = AccessResolver<
  StatCardAccessMode,
  StatCardAccessRule
>;

export interface StatCardProps {
  label: string;
  value: ReactNode;
  icon?: LucideIcon;
  delta?: string;
  trend?: StatCardTrend;
  description?: ReactNode;
  className?: string;
  valueClassName?: string;
  onClick?: () => void;
  ariaLabel?: string;
  access?: StatCardAccessConfig;
  canAccess?: StatCardAccessResolver;
}
