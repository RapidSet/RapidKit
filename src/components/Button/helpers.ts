import type { ButtonProps } from './types';

const canAccess = (
  requirements: string[],
  resolveAccess: ButtonProps['resolveAccess'],
  mode: 'action',
) => {
  if (!requirements.length || !resolveAccess) {
    return true;
  }

  return requirements.every((requirement) => resolveAccess(requirement, mode));
};

export const resolveButtonAccessState = (
  requirements: string[] | undefined,
  resolveAccess: ButtonProps['resolveAccess'],
  accessDeniedBehavior: ButtonProps['accessDeniedBehavior'] = 'disable',
) => {
  const normalizedRequirements = requirements ?? [];
  const hasAccessConfig =
    normalizedRequirements.length > 0 && Boolean(resolveAccess);

  const hasActionAccess = hasAccessConfig
    ? canAccess(normalizedRequirements, resolveAccess, 'action')
    : true;

  return {
    canView: accessDeniedBehavior === 'hide' ? hasActionAccess : true,
    canClick: hasActionAccess,
  };
};
