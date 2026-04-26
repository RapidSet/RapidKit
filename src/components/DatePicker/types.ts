import type {
  AccessConfig,
  AccessMatch,
  AccessResolver,
  AccessRule,
} from '@lib/access-types';

export type DatePickerAccessMode = 'view' | 'edit';

export type DatePickerAccessMatch = AccessMatch;

export type DatePickerAccessRule = AccessRule<DatePickerAccessMode>;

export type DatePickerAccessConfig = AccessConfig<DatePickerAccessMode>;

export type DatePickerAccessResolver = AccessResolver<
  DatePickerAccessMode,
  DatePickerAccessRule
>;

export interface DatePickerChange {
  target: {
    name: string;
    value: string | undefined;
  };
}

export interface DatePickerProps {
  name: string;
  value?: string;
  onChange: (change: DatePickerChange) => void;
  label?: string;
  disabled?: boolean;
  required?: boolean;
  helperText?: string;
  error?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  placeholder?: string;
  startMonth?: Date;
  endMonth?: Date;
  access?: DatePickerAccessConfig;
  canAccess?: DatePickerAccessResolver;
}
