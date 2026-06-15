import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import type {
  AccessConfig,
  AccessResolver,
  AccessRule,
} from '@lib/access-types';

export type TopBarAccessMode = 'view' | 'edit';
export type TopBarAccessRule = AccessRule<TopBarAccessMode>;
export type TopBarAccessConfig = AccessConfig<TopBarAccessMode>;
export type TopBarAccessResolver = AccessResolver<
  TopBarAccessMode,
  TopBarAccessRule
>;

export type TopBarActionTone = 'default' | 'primary' | 'destructive';

export interface TopBarAction {
  key: string;
  label: string;
  icon?: LucideIcon;
  href?: string;
  badge?: ReactNode;
  tone?: TopBarActionTone;
  disabled?: boolean;
  access?: TopBarAccessConfig;
  onSelect?: () => void;
}

export interface TopBarQuickAction {
  label: string;
  icon?: LucideIcon;
  href?: string;
  disabled?: boolean;
  access?: TopBarAccessConfig;
  onSelect?: () => void;
}

export interface TopBarUserInfo {
  name: string;
  email?: string;
  avatarUrl?: string;
  initials?: string;
}

export interface TopBarUserAction {
  key: string;
  label: string;
  icon?: LucideIcon;
  disabled?: boolean;
  access?: TopBarAccessConfig;
  onSelect?: () => void;
}

export type TopBarProps = Readonly<{
  title?: ReactNode;
  subtitle?: ReactNode;
  leadingActions?: TopBarAction[];
  trailingActions?: TopBarAction[];
  quickAction?: TopBarQuickAction;
  user?: TopBarUserInfo;
  userMenu?: TopBarUserAction[];
  className?: string;
  access?: TopBarAccessConfig;
  canAccess?: TopBarAccessResolver;
}>;
