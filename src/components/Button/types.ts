import type { ReactNode, ComponentPropsWithoutRef } from 'react';
import type { LucideIcon } from 'lucide-react';
import type { Button as ButtonPrimitive } from '@ui/button';
import type { ButtonVariant } from './styles';

export type ButtonAccessMode = 'action';

export type ButtonAccessDeniedBehavior = 'hide' | 'disable';

export type ButtonAccessResolver = (
  requirement: string,
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
  accessRequirements?: string[];
  resolveAccess?: ButtonAccessResolver;
  accessDeniedBehavior?: ButtonAccessDeniedBehavior;
  children?: ReactNode;
}
