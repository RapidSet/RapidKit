import * as React from 'react';
import type {
  AccessConfig,
  AccessMatch,
  AccessResolver,
  AccessRule,
} from '@lib/access-types';

export type InputAccessMode = 'view' | 'edit';

export type InputAccessMatch = AccessMatch;

export type InputAccessRule = AccessRule<InputAccessMode>;

export type InputAccessConfig = AccessConfig<InputAccessMode>;

export type InputAccessResolver = AccessResolver<
  InputAccessMode,
  InputAccessRule
>;

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
