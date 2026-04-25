import type { ButtonProps } from './types';

const matchesActionAccess = (
  access: ButtonProps['access'],
  canAccess: ButtonProps['canAccess'],
  mode: 'action',
) => {
  const rules = access?.rules ?? [];

  if (!rules.length || !canAccess) {
    return true;
  }

  const match = access?.match ?? 'all';
  if (match === 'any') {
    return rules.some((rule) => canAccess(rule, mode));
  }

  return rules.every((rule) => canAccess(rule, mode));
};

export const resolveButtonAccessState = (
  access: ButtonProps['access'],
  canAccess: ButtonProps['canAccess'],
  accessDeniedBehavior: ButtonProps['accessDeniedBehavior'] = 'disable',
) => {
  const hasActionAccess = matchesActionAccess(access, canAccess, 'action');

  return {
    canView: accessDeniedBehavior === 'hide' ? hasActionAccess : true,
    canClick: hasActionAccess,
  };
};
