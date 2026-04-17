import type { ChangeEvent, InputHTMLAttributes } from 'react';

export type CheckboxAccessMode = 'view' | 'edit';

export type CheckboxAccessResolver = (
  requirement: string,
  mode: CheckboxAccessMode,
) => boolean;

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
  accessRequirements?: string[];
  resolveAccess?: CheckboxAccessResolver;
}
