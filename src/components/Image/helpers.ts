import { resolveViewAccessState } from '@lib/view-edit-access';

export const imageSizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-16 w-16',
  lg: 'h-32 w-32',
} as const;

import type { ImageAccessConfig, ImageAccessResolver } from './types';

export const resolveImageAccessState = (
  access: ImageAccessConfig | undefined,
  canAccess: ImageAccessResolver | undefined,
) => resolveViewAccessState(access, canAccess);
