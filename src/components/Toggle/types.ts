import type { ComponentPropsWithoutRef } from 'react';
import { Switch as ShadcnSwitch } from '@ui/switch';
import type {
  AccessConfig,
  AccessMatch,
  AccessResolver,
  AccessRule,
} from '@lib/access-types';

export type ToggleAccessMode = 'view' | 'edit';

export type ToggleAccessMatch = AccessMatch;

export type ToggleAccessRule = AccessRule<ToggleAccessMode>;

export type ToggleAccessConfig = AccessConfig<ToggleAccessMode>;

export type ToggleAccessResolver = AccessResolver<
  ToggleAccessMode,
  ToggleAccessRule
>;

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
  access?: ToggleAccessConfig;
  canAccess?: ToggleAccessResolver;
}
