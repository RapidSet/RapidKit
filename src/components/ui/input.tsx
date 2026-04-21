import * as React from 'react';
import { cn } from '@lib/utils';

export const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<'input'>
>(({ className, type = 'text', ...props }, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        'flex h-[var(--rk-control-height)] w-full rounded-md border border-[hsl(var(--rk-control-border))] bg-background',
        'ring-1 ring-inset ring-[hsl(var(--rk-control-border))]',
        'px-[var(--rk-control-padding-x)] py-[var(--rk-control-padding-y)]',
        'text-[length:var(--rk-control-font-size)]',
        'shadow-[var(--rk-control-shadow)] transition-[background-color,color,border-color,box-shadow] duration-200',
        'file:border-0 file:bg-transparent file:text-sm file:font-medium',
        'placeholder:text-muted-foreground',
        'focus-visible:outline-none',
        'focus-visible:shadow-[var(--rk-control-shadow-focus)]',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  );
});

Input.displayName = 'Input';
