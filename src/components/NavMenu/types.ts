import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import type { NavigationMenu as NavigationMenuRoot } from '@ui/navigation-menu';
import type {
  AccessConfig,
  AccessResolver,
  AccessRule,
} from '@lib/access-types';

export type NavMenuAccessMode = 'view' | 'edit';
export type NavMenuAccessRule = AccessRule<NavMenuAccessMode>;
export type NavMenuAccessConfig = AccessConfig<NavMenuAccessMode>;
export type NavMenuAccessResolver = AccessResolver<
  NavMenuAccessMode,
  NavMenuAccessRule
>;

export interface NavMenuItem {
  id?: string;
  label: string;
  href: string;
  icon?: LucideIcon;
  description?: string;
  disabled?: boolean;
  external?: boolean;
  target?: ComponentPropsWithoutRef<'a'>['target'];
  rel?: string;
}

export interface NavMenuSection {
  id?: string;
  label: string;
  items: NavMenuItem[];
}

type NavigationMenuRootProps = ComponentPropsWithoutRef<
  typeof NavigationMenuRoot
>;

export interface NavMenuProps extends Pick<
  NavigationMenuRootProps,
  | 'value'
  | 'onValueChange'
  | 'dir'
  | 'orientation'
  | 'delayDuration'
  | 'skipDelayDuration'
> {
  sections: NavMenuSection[];
  className?: string;
  listClassName?: string;
  triggerClassName?: string;
  contentClassName?: string;
  linkClassName?: string;
  descriptionClassName?: string;
  viewportClassName?: string;
  ariaLabel?: string;
  access?: NavMenuAccessConfig;
  canAccess?: NavMenuAccessResolver;
  renderItem?: (item: NavMenuItem) => ReactNode;
}
