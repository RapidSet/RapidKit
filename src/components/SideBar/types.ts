import type { ComponentProps, ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import type { Sidebar, SidebarProvider } from '@ui/sidebar';
import type {
  AccessConfig,
  AccessMatch,
  AccessResolver,
  AccessRule,
} from '@lib/access-types';

export type SideBarAccessMode = 'view' | 'edit';

export type SideBarAccessMatch = AccessMatch;

export type SideBarAccessRule = AccessRule<SideBarAccessMode>;

export type SideBarAccessConfig = AccessConfig<SideBarAccessMode>;

export type SideBarAccessResolver = AccessResolver<
  SideBarAccessMode,
  SideBarAccessRule
>;

export interface SideBarMenuSubItem {
  key: string;
  label: string;
  href?: string;
  isActive?: boolean;
  disabled?: boolean;
  access?: SideBarAccessConfig;
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
  access?: SideBarAccessConfig;
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
  access?: SideBarAccessConfig;
  onSelect?: () => void;
}

export type SideBarItemVariant = 'minimal' | 'pill';

export interface SideBarWorkspaceAction {
  key: string;
  label: string;
  icon?: LucideIcon;
  disabled?: boolean;
  access?: SideBarAccessConfig;
  onSelect?: () => void;
}

export interface SideBarWorkspace {
  name: string;
  subtitle?: string;
  avatar?: ReactNode;
  initials?: string;
  href?: string;
  onSelect?: () => void;
  actions?: SideBarWorkspaceAction[];
  access?: SideBarAccessConfig;
}

export interface SideBarFavorites {
  label?: string;
  items: SideBarMenuItem[];
  defaultOpen?: boolean;
  access?: SideBarAccessConfig;
}

export interface SideBarBrandProps {
  className?: string;
  title?: string;
  subtitle?: string;
  logo?: ReactNode;
  renderLogo?: (open: boolean) => ReactNode;
  access?: SideBarAccessConfig;
  canAccess?: SideBarAccessResolver;
  readOnly?: boolean;
}

export interface SideBarWorkspaceSwitchProps {
  className?: string;
  workspace: SideBarWorkspace;
  access?: SideBarAccessConfig;
  canAccess?: SideBarAccessResolver;
  readOnly?: boolean;
}

export interface SideBarFavoritesSectionProps {
  className?: string;
  favorites: SideBarFavorites;
  itemVariant?: SideBarItemVariant;
  access?: SideBarAccessConfig;
  canAccess?: SideBarAccessResolver;
  readOnly?: boolean;
}

export interface SideBarNavMenuProps {
  className?: string;
  items: SideBarMenuItem[];
  itemVariant?: SideBarItemVariant;
  access?: SideBarAccessConfig;
  canAccess?: SideBarAccessResolver;
  readOnly?: boolean;
}

export interface SideBarUserMenuProps {
  className?: string;
  user: SideBarUserInfo;
  actions?: SideBarUserAction[];
  access?: SideBarAccessConfig;
  canAccess?: SideBarAccessResolver;
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
  workspace?: SideBarWorkspace;
  favorites?: SideBarFavorites;
  itemVariant?: SideBarItemVariant;
  user?: SideBarUserInfo;
  userActions?: SideBarUserAction[];
  showHeaderSeparator?: boolean;
  showRail?: boolean;
  headerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
  /**
   * Optional main content rendered as a sibling of the sidebar inside the
   * underlying SidebarProvider. Use this when SideBar is the app shell and
   * should sit next to a page rather than being rendered standalone.
   */
  mainContent?: ReactNode;
  providerProps?: Omit<ComponentProps<typeof SidebarProvider>, 'children'>;
  access?: SideBarAccessConfig;
  canAccess?: SideBarAccessResolver;
}
