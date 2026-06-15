import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import type {
  AccessConfig,
  AccessResolver,
  AccessRule,
} from '@lib/access-types';

export type BoardCardAccessMode = 'view' | 'edit';
export type BoardCardAccessRule = AccessRule<BoardCardAccessMode>;
export type BoardCardAccessConfig = AccessConfig<BoardCardAccessMode>;
export type BoardCardAccessResolver = AccessResolver<
  BoardCardAccessMode,
  BoardCardAccessRule
>;

export type BoardCardProps = Readonly<{
  title: ReactNode;
  icon?: LucideIcon;
  preview?: ReactNode;
  breadcrumb?: string[];
  starred?: boolean;
  onStarToggle?: () => void;
  onClick?: () => void;
  href?: string;
  className?: string;
  ariaLabel?: string;
  access?: BoardCardAccessConfig;
  canAccess?: BoardCardAccessResolver;
}>;
