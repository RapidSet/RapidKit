import type { ReactNode } from 'react';
import type { SideBarAccessResolver } from '@components/SideBar/types';
import { SideBarAccessContext } from '@components/SideBar/access-store';

export interface SideBarAccessProviderProps {
  children: ReactNode;
  canAccess?: SideBarAccessResolver;
}

export function SideBarAccessProvider(
  props: Readonly<SideBarAccessProviderProps>,
) {
  const { children, canAccess } = props;

  return (
    <SideBarAccessContext.Provider value={canAccess}>
      {children}
    </SideBarAccessContext.Provider>
  );
}
