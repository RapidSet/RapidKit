import type { ReactNode } from 'react';
import type {
  FormFieldChangeHandler,
  FormValues,
  UseFormHandlersReturn,
} from '@/hooks/useFormHandlers';
import type { ButtonProps } from '@components/Button';

export type FormSubmitState = {
  isSubmitting?: boolean;
  serverError?: string;
  successMessage?: string;
};

export type FormBannerRenderer = (text: string) => ReactNode;

export type FormProps<TValues extends FormValues> = {
  form: UseFormHandlersReturn<TValues>;
  children: ReactNode;
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
  className?: string;
  id?: string;
  noValidate?: boolean;
  isSubmitting?: boolean;
  disableOnSubmit?: boolean;
  resetOnSuccess?: boolean;
  serverError?: string;
  successMessage?: string;
  errorBanner?: ReactNode | FormBannerRenderer;
  successBanner?: ReactNode | FormBannerRenderer;
};

export type FormFieldKind = 'text' | 'checkbox' | 'auto';

export type FormFieldRenderArgs = {
  name: string;
  value: unknown;
  checked: boolean;
  onChange: FormFieldChangeHandler;
  onCheckChange: (checked: boolean) => void;
  onBlur: () => void;
  error?: string;
  required?: boolean;
  disabled: boolean;
  id: string;
};

export type FormFieldChildRenderer = (field: FormFieldRenderArgs) => ReactNode;

export type FormFieldProps = {
  name: string;
  label?: string;
  helperText?: string;
  description?: string;
  infoText?: string;
  required?: boolean;
  error?: string;
  className?: string;
  as?: FormFieldKind;
  showUntouchedError?: boolean;
  children: ReactNode | FormFieldChildRenderer;
};

export type FormSubmitProps = Omit<
  ButtonProps,
  'type' | 'loading' | 'disabled'
> & {
  type?: 'submit' | 'button';
  disabled?: boolean;
  loadingWhenSubmitting?: boolean;
  disableWhenSubmitting?: boolean;
};
