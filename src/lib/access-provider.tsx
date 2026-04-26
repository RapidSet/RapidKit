import type { ReactNode } from 'react';
import {
  RapidKitAccessContext,
  type RapidKitAccessResolver,
} from '@lib/access-store';

export interface RapidKitAccessProviderProps {
  children: ReactNode;
  canAccess?: RapidKitAccessResolver;
}

export function RapidKitAccessProvider(
  props: Readonly<RapidKitAccessProviderProps>,
) {
  const { children, canAccess } = props;

  return (
    <RapidKitAccessContext.Provider value={canAccess}>
      {children}
    </RapidKitAccessContext.Provider>
  );
}
