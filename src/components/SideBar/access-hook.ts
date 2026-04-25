import { useContext } from 'react';
import { SideBarAccessContext } from '@components/SideBar/access-store';
import type { SideBarAccessResolver } from '@components/SideBar/types';

export const useSideBarAccessResolver = (
  explicitCanAccess?: SideBarAccessResolver,
): SideBarAccessResolver | undefined => {
  const inheritedCanAccess = useContext(SideBarAccessContext);
  return explicitCanAccess ?? inheritedCanAccess;
};
