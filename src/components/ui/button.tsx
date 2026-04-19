import * as React from 'react';
import { cn } from '@lib/utils';

export type ButtonPrimitiveVariant =
  | 'default'
  | 'destructive'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'link';

export type ButtonPrimitiveSize = 'default' | 'sm' | 'lg' | 'icon';

const BUTTON_VARIANT_CLASSES: Record<ButtonPrimitiveVariant, string> = {
  default: 'bg-primary text-primary-foreground hover:bg-primary/92',
  destructive:
    'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  outline:
    'border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/85',
  ghost:
    'bg-transparent text-foreground shadow-none hover:bg-accent hover:text-accent-foreground hover:shadow-none',
  link: 'h-auto rounded-none bg-transparent p-0 text-primary shadow-none underline-offset-4 hover:underline hover:shadow-none',
};

const BUTTON_SIZE_CLASSES: Record<ButtonPrimitiveSize, string> = {
  default:
    'h-[var(--mz-control-height)] px-[var(--mz-button-padding-x)] py-[var(--mz-button-padding-y)] text-[length:var(--mz-button-font-size)] font-[var(--mz-button-font-weight)] tracking-[var(--mz-button-letter-spacing)]',
  sm: 'h-9 rounded-md px-3',
  lg: 'h-11 rounded-md px-8',
  icon: 'h-10 w-10',
};

export interface ButtonPrimitiveProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonPrimitiveVariant;
  size?: ButtonPrimitiveSize;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonPrimitiveProps>(
  (
    {
      className,
      variant = 'default',
      size = 'default',
      type = 'button',
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md',
          'shadow-[var(--mz-button-shadow)]',
          'transition-[background-color,color,border-color,box-shadow,transform] duration-200',
          'hover:shadow-[var(--mz-button-shadow-hover)] active:translate-y-[1px]',
          'focus-visible:outline-none focus-visible:shadow-[var(--mz-button-shadow-hover)]',
          'disabled:pointer-events-none disabled:translate-y-0 disabled:opacity-50 disabled:shadow-none',
          '[&_svg]:pointer-events-none [&_svg]:shrink-0',
          BUTTON_VARIANT_CLASSES[variant],
          BUTTON_SIZE_CLASSES[size],
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = 'Button';
