import type * as React from 'react';
import type { LucideIcon } from 'lucide-react';

export type ChipVariant = 'primary' | 'secondary' | 'outline';
export type ChipSize = 'sm' | 'md' | 'lg';
export type ChipAccessMode = 'view' | 'edit';

export type ChipAccessResolver = (
  requirement: string,
  mode: ChipAccessMode,
) => boolean;

export interface ChipProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: ChipVariant;
  size?: ChipSize;
  icon?: LucideIcon;
  label?: string;
  iconClassName?: string;
  pulse?: boolean;
  onRemove?: () => void;
  disabled?: boolean;
  accessRequirements?: string[];
  resolveAccess?: ChipAccessResolver;
}
