import type { ChipSize, ChipVariant } from './types';

export const CHIP_SIZE_CLASSES: Record<ChipSize, string> = {
  sm: 'px-1.5 py-0.5 text-xs',
  md: 'px-2 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
};

export const CHIP_ICON_SIZE_CLASSES: Record<ChipSize, string> = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
};

export const CHIP_CLOSE_ICON_SIZE_CLASSES: Record<ChipSize, string> = {
  sm: 'h-3 w-3',
  md: 'h-3.5 w-3.5',
  lg: 'h-4 w-4',
};

export const CHIP_VARIANT_CLASSES: Record<ChipVariant, string> = {
  primary: 'border-primary bg-primary text-primary-foreground',
  secondary: 'border-secondary bg-secondary text-secondary-foreground',
  outline: 'border-border bg-background text-foreground',
};
