import type { InputAccessConfig, InputAccessResolver } from './types';

const matchesAccess = (
  rules: NonNullable<InputAccessConfig['rules']>,
  access: InputAccessConfig | undefined,
  canAccess: InputAccessResolver | undefined,
  mode: 'view' | 'edit',
) => {
  if (!rules.length || !canAccess) {
    return true;
  }

  const match = access?.match ?? 'any';
  if (match === 'all') {
    return rules.every((rule) => canAccess(rule, mode));
  }

  return rules.some((rule) => canAccess(rule, mode));
};

export const resolveInputAccess = (
  access: InputAccessConfig | undefined,
  canAccess: InputAccessResolver | undefined,
) => {
  const rules = access?.rules ?? [];

  const viewRules = rules.filter(
    (rule) => rule.mode === 'view' || rule.action === 'read',
  );
  const editRules = rules.filter(
    (rule) =>
      rule.mode === 'edit' || (rule.mode == null && rule.action !== 'read'),
  );

  const hasViewPermission = matchesAccess(viewRules, access, canAccess, 'view');
  if (!hasViewPermission) {
    return {
      hasViewPermission,
      hasEditPermission: false,
    };
  }

  const hasEditPermission = matchesAccess(editRules, access, canAccess, 'edit');

  return {
    hasViewPermission,
    hasEditPermission,
  };
};
