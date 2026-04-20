import type { ButtonProps as UIButtonProps } from '@ui/button';

type ButtonPrimitiveVariant = NonNullable<UIButtonProps['variant']>;

export enum ButtonVariant {
  Primary = 'primary',
  Default = 'default',
  Dashed = 'dashed',
  Outlined = 'outlined',
  Text = 'text',
  Destructive = 'destructive',
}

export const BUTTON_VARIANT_CLASS_NAMES: Record<ButtonVariant, string> = {
  [ButtonVariant.Primary]:
    'border border-[hsl(var(--mz-control-border))] bg-gradient-to-b from-primary to-primary/90 text-primary-foreground hover:from-primary/95 hover:to-primary/85',
  [ButtonVariant.Default]:
    'border border-[hsl(var(--mz-control-border))] bg-card text-card-foreground hover:bg-muted/90',
  [ButtonVariant.Dashed]:
    'border-2 border-dashed border-[hsl(var(--mz-control-border))] bg-background text-foreground hover:bg-muted/65',
  [ButtonVariant.Outlined]:
    'border border-[hsl(var(--mz-control-border))] bg-transparent text-foreground hover:bg-accent/55 hover:text-accent-foreground',
  [ButtonVariant.Text]:
    'h-auto rounded-none px-0 py-0 text-primary shadow-none hover:text-primary/90 hover:shadow-none',
  [ButtonVariant.Destructive]:
    'border border-[hsl(var(--mz-control-border))] bg-destructive text-destructive-foreground hover:bg-destructive/90',
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
  [ButtonVariant.Destructive]: 'destructive',
};
