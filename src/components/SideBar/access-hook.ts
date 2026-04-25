import { useAccessResolver } from '@lib/use-access-resolver';
import type { SideBarAccessResolver } from '@components/SideBar/types';

export const useSideBarAccessResolver = (
  explicitCanAccess?: SideBarAccessResolver,
): SideBarAccessResolver | undefined => {
  return useAccessResolver(explicitCanAccess);
};
