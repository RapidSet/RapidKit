import { createContext } from 'react';
import type { SideBarAccessResolver } from '@components/SideBar/types';

export const SideBarAccessContext = createContext<
  SideBarAccessResolver | undefined
>(undefined);
