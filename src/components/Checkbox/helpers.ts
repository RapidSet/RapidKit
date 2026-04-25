import { resolveViewEditAccessState } from '@lib/view-edit-access';
import type { CheckBoxProps } from './types';

export const checkboxBaseClassName =
  'h-[var(--rk-checkbox-size)] w-[var(--rk-checkbox-size)] shrink-0 appearance-none rounded-full border border-solid border-[hsl(var(--rk-control-border))] bg-background shadow-[var(--rk-control-shadow)] transition-[background-color,color,border-color,box-shadow] duration-200 checked:border-primary checked:bg-primary focus-visible:outline-none focus-visible:shadow-[var(--rk-control-shadow-focus)] disabled:cursor-not-allowed disabled:opacity-50';

export const resolveCheckboxAccessState = (
  access: CheckBoxProps['access'],
  canAccess: CheckBoxProps['canAccess'],
) => resolveViewEditAccessState(access, canAccess);
