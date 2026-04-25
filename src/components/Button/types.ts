import type { ReactNode, ComponentPropsWithoutRef } from 'react';
import type { LucideIcon } from 'lucide-react';
import type { Button as ButtonPrimitive } from '@ui/button';
import type { ButtonVariant } from './styles';

export type ButtonAccessMode = 'action';

export type ButtonAccessMatch = 'any' | 'all';

export interface ButtonAccessRule {
  action: string;
  subject: string;
  mode?: ButtonAccessMode;
}

export interface ButtonAccessConfig {
  rules: ButtonAccessRule[];
  match?: ButtonAccessMatch;
}

export type ButtonAccessDeniedBehavior = 'hide' | 'disable';

export type ButtonAccessResolver = (
  rule: ButtonAccessRule,
  mode: ButtonAccessMode,
) => boolean;

export interface ButtonProps extends Omit<
  ComponentPropsWithoutRef<typeof ButtonPrimitive>,
  'children' | 'variant'
> {
  label?: string;
  loading?: boolean;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  variant?: ButtonVariant;
  access?: ButtonAccessConfig;
  canAccess?: ButtonAccessResolver;
  accessDeniedBehavior?: ButtonAccessDeniedBehavior;
  children?: ReactNode;
}
