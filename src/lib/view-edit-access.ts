import type {
  AccessConfig,
  AccessResolver,
  AccessRule,
} from '@lib/access-types';

const matchesAccess = <TMode extends string>(
  rules: AccessRule<TMode>[],
  access: AccessConfig<TMode> | undefined,
  canAccess: AccessResolver<TMode, AccessRule<TMode>> | undefined,
  mode: TMode,
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

export const resolveViewAccessState = <TMode extends 'view'>(
  access: AccessConfig<TMode> | undefined,
  canAccess: AccessResolver<TMode, AccessRule<TMode>> | undefined,
) => {
  const rules = access?.rules ?? [];
  const viewRules = rules.filter(
    (rule) => rule.mode === 'view' || rule.action === 'read',
  );

  return {
    canView: matchesAccess(viewRules, access, canAccess, 'view' as TMode),
  };
};

export const resolveViewEditAccessState = <TMode extends 'view' | 'edit'>(
  access: AccessConfig<TMode> | undefined,
  canAccess: AccessResolver<TMode, AccessRule<TMode>> | undefined,
) => {
  const rules = access?.rules ?? [];

  const viewRules = rules.filter(
    (rule) => rule.mode === 'view' || rule.action === 'read',
  );
  const editRules = rules.filter(
    (rule) =>
      rule.mode === 'edit' || (rule.mode == null && rule.action !== 'read'),
  );

  const canView = matchesAccess(viewRules, access, canAccess, 'view' as TMode);
  const canEdit = matchesAccess(editRules, access, canAccess, 'edit' as TMode);

  return {
    canView,
    canEdit,
  };
};
