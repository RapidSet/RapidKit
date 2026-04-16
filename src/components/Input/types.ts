import * as React from 'react';

export type InputAccessMode = 'view' | 'edit';

export type InputAccessResolver = (
  requirement: string,
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
  error?: string;
  helperText?: string;
  required?: boolean;
  infoText?: string;
  isLoading?: boolean;
  accessRequirements?: string[];
  resolveAccess?: InputAccessResolver;
};
