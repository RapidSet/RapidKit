import { resolveViewEditAccessState } from '@lib/view-edit-access';
import type { StatCardAccessConfig, StatCardAccessResolver } from './types';

export const resolveStatCardAccessState = (
  access: StatCardAccessConfig | undefined,
  canAccess: StatCardAccessResolver | undefined,
) => resolveViewEditAccessState(access, canAccess);
