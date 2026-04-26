import { createContext } from 'react';
import type { AccessResolver, AccessRule } from '@lib/access-types';

export type RapidKitAccessRule = AccessRule<string>;

export type RapidKitAccessResolver = AccessResolver<string, RapidKitAccessRule>;

export const RapidKitAccessContext = createContext<
  RapidKitAccessResolver | undefined
>(undefined);
