import type {
  SideBarAccessMode,
  SideBarAccessResolver,
  SideBarMenuItem,
  SideBarMenuSubItem,
  SideBarUserAction,
} from './types';

const canAccess = (
  requirements: string[],
  resolveAccess: SideBarAccessResolver | undefined,
  mode: SideBarAccessMode,
): boolean => {
  if (!requirements.length || !resolveAccess) {
    return true;
  }

  return requirements.some((requirement) => resolveAccess(requirement, mode));
};

export const resolveSideBarAccessState = (
  requirements: string[] | undefined,
  resolveAccess: SideBarAccessResolver | undefined,
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

  const editRequirements =
    writeRequirements.length > 0 ? writeRequirements : normalizedRequirements;

  let canView = true;
  if (hasAccessConfig && viewRequirements.length > 0) {
    canView = canAccess(viewRequirements, resolveAccess, 'view');
  }

  let canEdit = true;
  if (hasAccessConfig) {
    canEdit = canAccess(editRequirements, resolveAccess, 'edit');
  }

  return {
    canView,
    canEdit,
  };
};

export const resolveNodeAccessState = (
  requirements: string[] | undefined,
  resolveAccess: SideBarAccessResolver | undefined,
) => resolveSideBarAccessState(requirements, resolveAccess);

export const canViewMenuItem = (
  item: SideBarMenuItem,
  resolveAccess: SideBarAccessResolver | undefined,
) => {
  const { canView } = resolveNodeAccessState(
    item.accessRequirements,
    resolveAccess,
  );
  return canView;
};

export const canViewSubItem = (
  item: SideBarMenuSubItem,
  resolveAccess: SideBarAccessResolver | undefined,
) => {
  const { canView } = resolveNodeAccessState(
    item.accessRequirements,
    resolveAccess,
  );
  return canView;
};

export const canViewUserAction = (
  action: SideBarUserAction,
  resolveAccess: SideBarAccessResolver | undefined,
) => {
  const { canView } = resolveNodeAccessState(
    action.accessRequirements,
    resolveAccess,
  );
  return canView;
};
