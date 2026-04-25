import { resolveViewAccessState } from '@lib/view-edit-access';
import type { AvatarAccessConfig, AvatarAccessResolver } from './types';

export const resolveAvatarAccessState = (
  access: AvatarAccessConfig | undefined,
  canAccess: AvatarAccessResolver | undefined,
) => resolveViewAccessState(access, canAccess);

export const resolveAvatarFallbackText = (alt: string | undefined): string => {
  const normalized = alt?.trim();

  if (!normalized) {
    return '?';
  }

  const words = normalized.split(/\s+/).filter(Boolean);

  if (words.length === 1) {
    return words[0].slice(0, 1).toUpperCase();
  }

  return `${words[0].slice(0, 1)}${words[1].slice(0, 1)}`.toUpperCase();
};
