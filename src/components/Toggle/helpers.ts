import { resolveViewEditAccessState } from '@lib/view-edit-access';
import type { ToggleProps } from './types';

export const resolveToggleAccessState = (
  access: ToggleProps['access'],
  canAccess: ToggleProps['canAccess'],
) => resolveViewEditAccessState(access, canAccess);
