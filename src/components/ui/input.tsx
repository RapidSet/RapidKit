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
        'flex h-[var(--mz-control-height)] w-full rounded-md border border-[hsl(var(--mz-control-border))] bg-background',
        'ring-1 ring-inset ring-[hsl(var(--mz-control-border))]',
        'px-[var(--mz-control-padding-x)] py-[var(--mz-control-padding-y)]',
        'text-[length:var(--mz-control-font-size)]',
        'shadow-[var(--mz-control-shadow)] transition-[background-color,color,border-color,box-shadow] duration-200',
        'file:border-0 file:bg-transparent file:text-sm file:font-medium',
        'placeholder:text-muted-foreground',
        'focus-visible:outline-none',
        'focus-visible:shadow-[var(--mz-control-shadow-focus)]',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  );
});

Input.displayName = 'Input';
