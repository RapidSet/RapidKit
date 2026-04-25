import type { ReactNode } from 'react';
import type {
  AccessConfig,
  AccessResolver,
  AccessRule,
} from '@lib/access-types';

export type DropDownAccessMode = 'view' | 'edit';
export type DropDownAccessRule = AccessRule<DropDownAccessMode>;
export type DropDownAccessConfig = AccessConfig<DropDownAccessMode>;
export type DropDownAccessResolver = AccessResolver<
  DropDownAccessMode,
  DropDownAccessRule
>;

export interface DropDownProps {
  label?: string;
  className?: string;
  value?: string;
  onChange: (value: string) => void;
  options: DropDownOption[];
  placeholder?: string;
  renderOption?: (option: DropDownOption) => ReactNode;
  disabled?: boolean;
  required?: boolean;
  helperText?: string;
  error?: string;
  onOpenChange?: (open: boolean) => void;
  access?: DropDownAccessConfig;
  canAccess?: DropDownAccessResolver;
}

export interface DropDownOption {
  label: string;
  value: string;
}
