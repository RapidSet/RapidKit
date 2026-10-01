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
  /**
   * Show the inline clear (×) button when a value is selected. Clearing
   * emits `onChange('')`. Set to `false` when the option list already
   * models "no selection" as an explicit option (e.g. `All`). Defaults to `true`.
   */
  clearable?: boolean;
  onOpenChange?: (open: boolean) => void;
  access?: DropDownAccessConfig;
  canAccess?: DropDownAccessResolver;
}

export interface DropDownOption {
  label: string;
  value: string;
}
