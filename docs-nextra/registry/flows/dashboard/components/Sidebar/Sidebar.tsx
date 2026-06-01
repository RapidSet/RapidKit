import { useMemo } from 'react';
import {
  Image,
  SideBar,
  SideBarBrand,
  type SideBarMenuItem,
} from '@rapidset/rapidkit';
import { DASHBOARD_NAV } from './consts';
import type { SidebarProps } from './types';

export function Sidebar({ activeNav, onSelectNav, mainContent }: SidebarProps) {
  const sidebarItems: SideBarMenuItem[] = useMemo(
    () =>
      DASHBOARD_NAV.map((item) => ({
        key: item.key,
        label: item.label,
        icon: item.icon,
        group: item.group,
        access: item.access,
        isActive:
          activeNav === item.key || activeNav.startsWith(`${item.key}.`),
        onSelect: () => onSelectNav(item.key),
        items: item.items?.map((subItem) => ({
          key: subItem.key,
          label: subItem.label,
          access: subItem.access,
          isActive: activeNav === subItem.key,
          onSelect: () => onSelectNav(subItem.key),
        })),
      })),
    [activeNav, onSelectNav],
  );

  return (
    <SideBar
      menuItems={sidebarItems}
      user={{ name: 'Avery Quinn', email: 'avery@rapidset.io' }}
      providerProps={{ defaultOpen: true }}
      collapsible="icon"
      brand={
        <SideBarBrand
          title="RapidKit"
          subtitle="Workspace"
          logo={
            <Image
              src="/rapidkit.svg"
              alt="RapidKit"
              size="sm"
              className="h-7 w-7"
            />
          }
        />
      }
      mainContent={mainContent}
    />
  );
}
