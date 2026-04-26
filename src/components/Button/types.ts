import type { ReactNode, ComponentPropsWithoutRef } from 'react';
import type { LucideIcon } from 'lucide-react';
import type { Button as ButtonPrimitive } from '@ui/button';
import type {
  AccessConfig,
  AccessMatch,
  AccessResolver,
  AccessRule,
} from '@lib/access-types';
import type { ButtonVariant } from './styles';

export type ButtonAccessMode = 'action';

export type ButtonAccessMatch = AccessMatch;

export type ButtonAccessRule = AccessRule<ButtonAccessMode>;

export type ButtonAccessConfig = AccessConfig<ButtonAccessMode>;

export type ButtonAccessDeniedBehavior = 'hide' | 'disable';

export type ButtonAccessResolver = AccessResolver<
  ButtonAccessMode,
  ButtonAccessRule
>;

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
