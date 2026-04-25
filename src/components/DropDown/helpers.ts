import { resolveViewEditAccessState } from '@lib/view-edit-access';
import type { DropDownAccessConfig, DropDownAccessResolver } from './types';

export const resolveDropDownAccessState = (
  access: DropDownAccessConfig | undefined,
  canAccess: DropDownAccessResolver | undefined,
) => resolveViewEditAccessState(access, canAccess);
