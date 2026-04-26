import type { ReactNode } from 'react';
import type { SideBarAccessResolver } from '@components/SideBar/types';
import { RapidKitAccessProvider } from '@lib/access-provider';
import type { RapidKitAccessResolver } from '@lib/access-store';

export interface SideBarAccessProviderProps {
  children: ReactNode;
  canAccess?: SideBarAccessResolver;
}

export function SideBarAccessProvider(
  props: Readonly<SideBarAccessProviderProps>,
) {
  const { children, canAccess } = props;

  return (
    <RapidKitAccessProvider
      canAccess={canAccess as RapidKitAccessResolver | undefined}
    >
      {children}
    </RapidKitAccessProvider>
  );
}
