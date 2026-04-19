import type { CheckBoxProps } from './types';

export const canAccess = (
  requirements: string[] | undefined,
  resolveAccess: CheckBoxProps['resolveAccess'],
  mode: 'view' | 'edit',
): boolean => {
  if (!requirements?.length || !resolveAccess) {
    return true;
  }

  return requirements.some((requirement) => resolveAccess(requirement, mode));
};

export const checkboxBaseClassName =
  'h-[var(--mz-checkbox-size)] w-[var(--mz-checkbox-size)] shrink-0 appearance-none rounded-full border-2 border-input bg-background shadow-[inset_0_0_0_1px_hsl(var(--mz-foreground)/0.35),var(--mz-control-shadow)] transition-[background-color,color,border-color,box-shadow] duration-200 checked:border-primary checked:bg-primary checked:shadow-[var(--mz-control-shadow)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:shadow-[var(--mz-control-shadow-focus)] disabled:cursor-not-allowed disabled:opacity-50';

export const resolveCheckboxAccessState = (
  requirements: string[] | undefined,
  resolveAccess: CheckBoxProps['resolveAccess'],
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
