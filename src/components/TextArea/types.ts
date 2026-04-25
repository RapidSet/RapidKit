import * as React from 'react';
import type {
  AccessConfig,
  AccessMatch,
  AccessResolver,
  AccessRule,
} from '@lib/access-types';

export type TextAreaAccessMode = 'view' | 'edit';

export type TextAreaAccessMatch = AccessMatch;

export type TextAreaAccessRule = AccessRule<TextAreaAccessMode>;

export type TextAreaAccessConfig = AccessConfig<TextAreaAccessMode>;

export type TextAreaAccessResolver = AccessResolver<
  TextAreaAccessMode,
  TextAreaAccessRule
>;

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
  access?: TextAreaAccessConfig;
  canAccess?: TextAreaAccessResolver;
};
