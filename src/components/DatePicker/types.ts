export type DatePickerAccessMode = 'view' | 'edit';

export type DatePickerAccessResolver = (
  requirement: string,
  mode: DatePickerAccessMode,
) => boolean;

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
  accessRequirements?: string[];
  resolveAccess?: DatePickerAccessResolver;
}
