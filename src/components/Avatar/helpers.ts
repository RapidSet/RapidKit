import type { AvatarProps } from './types';

export const canAccess = (
  requirements: string[] | undefined,
  resolveAccess: AvatarProps['resolveAccess'],
  mode: 'view',
): boolean => {
  if (!requirements?.length || !resolveAccess) {
    return true;
  }

  return requirements.some((requirement) => resolveAccess(requirement, mode));
};

export const resolveAvatarAccessState = (
  requirements: string[] | undefined,
  resolveAccess: AvatarProps['resolveAccess'],
) => {
  const normalizedRequirements = requirements ?? [];
  const hasAccessConfig =
    normalizedRequirements.length > 0 && Boolean(resolveAccess);

  const readRequirements = normalizedRequirements.filter((requirement) =>
    requirement.endsWith('.read'),
  );
  const writeRequirements = normalizedRequirements.filter((requirement) =>
    requirement.endsWith('.write'),
  );

  let viewRequirements = normalizedRequirements;
  if (readRequirements.length > 0) {
    viewRequirements = readRequirements;
  } else if (writeRequirements.length > 0) {
    viewRequirements = [];
  }

  let canView = true;
  if (hasAccessConfig && viewRequirements.length > 0) {
    canView = canAccess(viewRequirements, resolveAccess, 'view');
  }

  return {
    canView,
  };
};

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
