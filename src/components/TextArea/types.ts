import * as React from 'react';

export type TextAreaAccessMode = 'view' | 'edit';

export type TextAreaAccessResolver = (
  requirement: string,
  mode: TextAreaAccessMode,
) => boolean;

type BaseTextAreaProps = Omit<
  React.ComponentPropsWithoutRef<'textarea'>,
  'name' | 'value' | 'onChange'
>;

export type TextAreaProps = BaseTextAreaProps & {
  label?: string;
  name: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
  helperText?: string;
  required?: boolean;
  infoText?: string;
  accessRequirements?: string[];
  resolveAccess?: TextAreaAccessResolver;
};
