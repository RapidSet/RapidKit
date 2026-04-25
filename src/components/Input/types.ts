import * as React from 'react';

export type InputAccessMode = 'view' | 'edit';

export type InputAccessMatch = 'any' | 'all';

export interface InputAccessRule {
  action: string;
  subject: string;
  mode?: InputAccessMode;
}

export interface InputAccessConfig {
  rules: InputAccessRule[];
  match?: InputAccessMatch;
}

export type InputAccessResolver = (
  rule: InputAccessRule,
  mode: InputAccessMode,
) => boolean;

type BaseInputProps = Omit<
  React.ComponentPropsWithoutRef<'input'>,
  'name' | 'value' | 'onChange' | 'type'
>;

export type InputProps = BaseInputProps & {
  type?: React.HTMLInputTypeAttribute;
  label?: string;
  name: string;
  value?: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  endAdornment?: React.ReactNode;
  error?: string;
  helperText?: string;
  required?: boolean;
  infoText?: string;
  isLoading?: boolean;
  access?: InputAccessConfig;
  canAccess?: InputAccessResolver;
};
