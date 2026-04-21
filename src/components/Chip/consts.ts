import type { ChipSize, ChipVariant } from './types';

export const CHIP_SIZE_CLASSES: Record<ChipSize, string> = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-2.5 py-1.5 text-sm',
  lg: 'px-3.5 py-2 text-base',
};

export const CHIP_ICON_SIZE_CLASSES: Record<ChipSize, string> = {
  sm: 'h-[1em] w-[1em]',
  md: 'h-[1em] w-[1em]',
  lg: 'h-[1em] w-[1em]',
};

export const CHIP_CLOSE_ICON_SIZE_CLASSES: Record<ChipSize, string> = {
  sm: 'h-[0.9em] w-[0.9em]',
  md: 'h-[0.9em] w-[0.9em]',
  lg: 'h-[0.9em] w-[0.9em]',
};

export const CHIP_VARIANT_CLASSES: Record<ChipVariant, string> = {
  primary: 'border-primary bg-primary text-primary-foreground',
  secondary: 'border-secondary bg-secondary text-secondary-foreground',
  outline: 'border-border bg-background text-foreground',
};
