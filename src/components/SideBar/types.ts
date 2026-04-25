import type { ComponentProps, ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import type { Sidebar, SidebarProvider } from '@ui/sidebar';

export type SideBarAccessMode = 'view' | 'edit';

export type SideBarAccessResolver = (
  requirement: string,
  mode: SideBarAccessMode,
) => boolean;

export interface SideBarMenuSubItem {
  key: string;
  label: string;
  href?: string;
  isActive?: boolean;
  disabled?: boolean;
  accessRequirements?: string[];
  onSelect?: () => void;
}

export interface SideBarMenuItem {
  key: string;
  label: string;
  group?: string;
  href?: string;
  icon?: LucideIcon;
  badge?: string;
  isActive?: boolean;
  disabled?: boolean;
  accessRequirements?: string[];
  onSelect?: () => void;
  items?: SideBarMenuSubItem[];
}

export interface SideBarUserInfo {
  name: string;
  email?: string;
  avatar?: ReactNode;
}

export interface SideBarUserAction {
  key: string;
  label: string;
  icon?: LucideIcon;
  disabled?: boolean;
  accessRequirements?: string[];
  onSelect?: () => void;
}

export interface SideBarBrandProps {
  className?: string;
  title?: string;
  subtitle?: string;
  logo?: ReactNode;
  renderLogo?: (open: boolean) => ReactNode;
  accessRequirements?: string[];
  resolveAccess?: SideBarAccessResolver;
  readOnly?: boolean;
}

export interface SideBarNavMenuProps {
  className?: string;
  items: SideBarMenuItem[];
  accessRequirements?: string[];
  resolveAccess?: SideBarAccessResolver;
  readOnly?: boolean;
}

export interface SideBarUserMenuProps {
  className?: string;
  user: SideBarUserInfo;
  actions?: SideBarUserAction[];
  accessRequirements?: string[];
  resolveAccess?: SideBarAccessResolver;
  readOnly?: boolean;
}

export interface SideBarProps extends Omit<
  ComponentProps<typeof Sidebar>,
  'children'
> {
  children?: ReactNode;
  brand?: ReactNode;
  navigation?: ReactNode;
  footer?: ReactNode;
  menuItems?: SideBarMenuItem[];
  user?: SideBarUserInfo;
  userActions?: SideBarUserAction[];
  showHeaderSeparator?: boolean;
  showRail?: boolean;
  headerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
  providerProps?: Omit<ComponentProps<typeof SidebarProvider>, 'children'>;
  accessRequirements?: string[];
  resolveAccess?: SideBarAccessResolver;
}
