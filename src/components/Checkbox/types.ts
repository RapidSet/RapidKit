import type { ChangeEvent, InputHTMLAttributes } from 'react';
import type {
  AccessConfig,
  AccessMatch,
  AccessResolver,
  AccessRule,
} from '@lib/access-types';

export type CheckboxAccessMode = 'view' | 'edit';

export type CheckboxAccessMatch = AccessMatch;

export type CheckboxAccessRule = AccessRule<CheckboxAccessMode>;

export type CheckboxAccessConfig = AccessConfig<CheckboxAccessMode>;

export type CheckboxAccessResolver = AccessResolver<
  CheckboxAccessMode,
  CheckboxAccessRule
>;

export interface CheckBoxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'onChange'
> {
  onCheckChange?: (checked: boolean, name: string) => void;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  title?: string;
  name: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  access?: CheckboxAccessConfig;
  canAccess?: CheckboxAccessResolver;
}
