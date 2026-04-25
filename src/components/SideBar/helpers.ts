import type {
  SideBarAccessConfig,
  SideBarAccessMode,
  SideBarAccessResolver,
  SideBarAccessRule,
  SideBarMenuItem,
  SideBarMenuSubItem,
  SideBarUserAction,
} from './types';

export interface SideBarAbilityLike {
  can: (action: string, subject: string) => boolean;
}

const matchesAccess = (
  rules: SideBarAccessRule[],
  access: SideBarAccessConfig | undefined,
  canAccess: SideBarAccessResolver | undefined,
  mode: SideBarAccessMode,
): boolean => {
  if (!rules.length || !canAccess) {
    return true;
  }

  const match = access?.match ?? 'any';
  if (match === 'all') {
    return rules.every((rule) => canAccess(rule, mode));
  }

  return rules.some((rule) => canAccess(rule, mode));
};

export const resolveSideBarAccessState = (
  access: SideBarAccessConfig | undefined,
  canAccess: SideBarAccessResolver | undefined,
) => {
  const rules = access?.rules ?? [];

  const viewRules = rules.filter(
    (rule) => rule.mode === 'view' || rule.action === 'read',
  );
  const editRules = rules.filter(
    (rule) =>
      rule.mode === 'edit' || (rule.mode == null && rule.action !== 'read'),
  );

  const canView = matchesAccess(viewRules, access, canAccess, 'view');
  const canEdit = matchesAccess(editRules, access, canAccess, 'edit');

  return {
    canView,
    canEdit,
  };
};

export const resolveNodeAccessState = (
  access: SideBarAccessConfig | undefined,
  canAccess: SideBarAccessResolver | undefined,
) => resolveSideBarAccessState(access, canAccess);

export const canViewMenuItem = (
  item: SideBarMenuItem,
  canAccess: SideBarAccessResolver | undefined,
) => {
  const { canView } = resolveNodeAccessState(item.access, canAccess);
  return canView;
};

export const canViewSubItem = (
  item: SideBarMenuSubItem,
  canAccess: SideBarAccessResolver | undefined,
) => {
  const { canView } = resolveNodeAccessState(item.access, canAccess);
  return canView;
};

export const canViewUserAction = (
  action: SideBarUserAction,
  canAccess: SideBarAccessResolver | undefined,
) => {
  const { canView } = resolveNodeAccessState(action.access, canAccess);
  return canView;
};

export const createSideBarCaslResolver = (
  ability: SideBarAbilityLike,
): SideBarAccessResolver => {
  return (rule) => ability.can(rule.action, rule.subject);
};
