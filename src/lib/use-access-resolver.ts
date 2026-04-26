import { useContext } from 'react';
import {
  RapidKitAccessContext,
  type RapidKitAccessRule,
} from '@lib/access-store';

export const useAccessResolver = <
  TRule extends RapidKitAccessRule,
  TMode extends string,
>(
  explicitCanAccess?: (rule: TRule, mode: TMode) => boolean,
): ((rule: TRule, mode: TMode) => boolean) | undefined => {
  const inheritedCanAccess = useContext(RapidKitAccessContext);
  return (
    explicitCanAccess ??
    (inheritedCanAccess as ((rule: TRule, mode: TMode) => boolean) | undefined)
  );
};
