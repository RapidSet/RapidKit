import type { ComponentPropsWithoutRef } from 'react';
import { Switch as ShadcnSwitch } from '@ui/switch';

export type ToggleAccessMode = 'view' | 'edit';

export type ToggleAccessResolver = (
  requirement: string,
  mode: ToggleAccessMode,
) => boolean;

type TogglePrimitiveProps = Omit<
  ComponentPropsWithoutRef<typeof ShadcnSwitch>,
  'name' | 'onCheckedChange'
>;

export interface ToggleProps extends TogglePrimitiveProps {
  name: string;
  label?: string;
  title?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  onToggleChange?: (checked: boolean, name: string) => void;
  accessRequirements?: string[];
  resolveAccess?: ToggleAccessResolver;
}
