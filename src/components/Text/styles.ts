import type { TextTone, TextWeight } from './types';

export const TEXT_TONE_CLASS_NAMES: Record<TextTone, string> = {
  default: 'text-foreground',
  muted: 'text-muted-foreground',
  destructive: 'text-destructive',
  success: 'text-emerald-700 dark:text-emerald-400',
};

export const TEXT_WEIGHT_CLASS_NAMES: Record<TextWeight, string> = {
  regular: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};
