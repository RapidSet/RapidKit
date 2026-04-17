import type { ButtonPrimitiveVariant } from '@ui/button';

export enum ButtonVariant {
  Primary = 'primary',
  Default = 'default',
  Dashed = 'dashed',
  Outlined = 'outlined',
  Text = 'text',
  Destructive = 'destructive',
}

export const BUTTON_VARIANT_CLASS_NAMES: Record<ButtonVariant, string> = {
  [ButtonVariant.Primary]: '',
  [ButtonVariant.Default]: '',
  [ButtonVariant.Dashed]: 'border-dashed',
  [ButtonVariant.Outlined]: '',
  [ButtonVariant.Text]: 'h-auto px-0 py-0',
  [ButtonVariant.Destructive]: '',
};

export const BUTTON_VARIANT_MAPPING: Record<
  ButtonVariant,
  ButtonPrimitiveVariant
> = {
  [ButtonVariant.Primary]: 'default',
  [ButtonVariant.Default]: 'default',
  [ButtonVariant.Dashed]: 'outline',
  [ButtonVariant.Outlined]: 'outline',
  [ButtonVariant.Text]: 'link',
  [ButtonVariant.Destructive]: 'destructive',
};
