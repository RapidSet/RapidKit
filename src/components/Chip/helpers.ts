import { resolveViewEditAccessState } from '@lib/view-edit-access';
import type { ChipAccessConfig, ChipAccessResolver } from './types';

export const resolveChipAccessState = (
  access: ChipAccessConfig | undefined,
  canAccess: ChipAccessResolver | undefined,
) => resolveViewEditAccessState(access, canAccess);
