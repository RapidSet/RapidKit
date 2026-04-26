import type * as React from 'react';
import type {
  AccessConfig,
  AccessResolver,
  AccessRule,
} from '@lib/access-types';
import type { LucideIcon } from 'lucide-react';

export type ChipVariant = 'primary' | 'secondary' | 'outline';
export type ChipSize = 'sm' | 'md' | 'lg';
export type ChipAccessMode = 'view' | 'edit';
export type ChipAccessRule = AccessRule<ChipAccessMode>;
export type ChipAccessConfig = AccessConfig<ChipAccessMode>;
export type ChipAccessResolver = AccessResolver<ChipAccessMode, ChipAccessRule>;

export interface ChipProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: ChipVariant;
  size?: ChipSize;
  icon?: LucideIcon;
  label?: string;
  iconClassName?: string;
  pulse?: boolean;
  onRemove?: () => void;
  disabled?: boolean;
  access?: ChipAccessConfig;
  canAccess?: ChipAccessResolver;
}
