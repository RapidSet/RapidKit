import type { ButtonProps as UIButtonProps } from '@ui/button';

type ButtonPrimitiveVariant = NonNullable<UIButtonProps['variant']>;

export enum ButtonVariant {
  Primary = 'primary',
  Default = 'default',
  Dashed = 'dashed',
  Outlined = 'outlined',
  Text = 'text',
  Icon = 'icon',
  Destructive = 'destructive',
}

export const BUTTON_VARIANT_CLASS_NAMES: Record<ButtonVariant, string> = {
  [ButtonVariant.Primary]:
    'border border-border bg-primary text-primary-foreground shadow-none hover:bg-primary/95 hover:text-primary-foreground hover:shadow-none',
  [ButtonVariant.Default]:
    'border border-border bg-secondary text-secondary-foreground shadow-none hover:bg-secondary/85 hover:text-secondary-foreground hover:shadow-none',
  [ButtonVariant.Dashed]:
    'border-2 border-dashed border-border bg-background text-foreground shadow-none hover:bg-foreground/5 hover:text-foreground hover:shadow-none',
  [ButtonVariant.Outlined]:
    'border border-border bg-transparent text-foreground shadow-none hover:bg-foreground/5 hover:text-foreground hover:shadow-none',
  [ButtonVariant.Text]:
    'h-auto rounded-none px-0 py-0 text-primary shadow-none hover:text-primary hover:shadow-none',
  [ButtonVariant.Icon]:
    'h-8 w-8 border border-border bg-transparent p-0 text-foreground/80 shadow-none hover:bg-muted hover:text-foreground hover:shadow-none',
  [ButtonVariant.Destructive]:
    'border border-border bg-destructive text-destructive-foreground hover:bg-destructive',
};

export const BUTTON_VARIANT_MAPPING: Record<
  ButtonVariant,
  ButtonPrimitiveVariant
> = {
  [ButtonVariant.Primary]: 'default',
  [ButtonVariant.Default]: 'secondary',
  [ButtonVariant.Dashed]: 'outline',
  [ButtonVariant.Outlined]: 'outline',
  [ButtonVariant.Text]: 'link',
  [ButtonVariant.Icon]: 'ghost',
  [ButtonVariant.Destructive]: 'destructive',
};
