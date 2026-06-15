import { createContext, useContext } from 'react';
import type {
  FormValues,
  UseFormHandlersReturn,
} from '@/hooks/useFormHandlers';

export type FormContextValue = {
  form: UseFormHandlersReturn<FormValues>;
  isSubmitting: boolean;
  disableOnSubmit: boolean;
  serverError?: string;
  formId?: string;
};

export const FormContext = createContext<FormContextValue | null>(null);

export const useFormContext = (): FormContextValue => {
  const ctx = useContext(FormContext);
  if (!ctx) {
    throw new Error(
      'Form context is missing. Wrap your form fields with <Form>.',
    );
  }
  return ctx;
};
