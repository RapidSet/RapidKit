import { useMemo, type FormEvent, type ReactNode } from 'react';
import { cn } from '@lib/utils';
import {
  formErrorTextClassName,
  formHelperTextClassName,
} from '@lib/feedbackText';
import type {
  FormValues,
  UseFormHandlersReturn,
} from '@/hooks/useFormHandlers';
import { FormContext, type FormContextValue } from './FormContext';
import type { FormBannerRenderer, FormProps } from './types';

const renderBanner = (
  banner: ReactNode | FormBannerRenderer | undefined,
  text: string,
  defaultClassName: string,
): ReactNode => {
  if (typeof banner === 'function') {
    return banner(text);
  }
  if (banner !== undefined) {
    return banner;
  }
  return <p className={defaultClassName}>{text}</p>;
};

export const Form = <TValues extends FormValues>(props: FormProps<TValues>) => {
  const {
    form,
    children,
    onSubmit,
    className,
    id,
    noValidate = true,
    isSubmitting = false,
    disableOnSubmit = true,
    resetOnSuccess = false,
    serverError,
    successMessage,
    errorBanner,
    successBanner,
  } = props;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    if (onSubmit) {
      await onSubmit(event);
      return;
    }

    const wasSubmitted = await form.handleSubmit(event);
    if (wasSubmitted && resetOnSuccess) {
      form.resetForm();
    }
  };

  const contextValue = useMemo<FormContextValue>(
    () => ({
      form: form as unknown as UseFormHandlersReturn<FormValues>,
      isSubmitting,
      disableOnSubmit,
      serverError,
      formId: id,
    }),
    [form, isSubmitting, disableOnSubmit, serverError, id],
  );

  const isFieldsetDisabled = isSubmitting && disableOnSubmit;

  return (
    <FormContext.Provider value={contextValue}>
      <form
        id={id}
        className={cn('space-y-4', className)}
        noValidate={noValidate}
        onSubmit={(event) => {
          void handleSubmit(event);
        }}
      >
        {serverError
          ? renderBanner(errorBanner, serverError, formErrorTextClassName)
          : null}
        {successMessage
          ? renderBanner(
              successBanner,
              successMessage,
              cn(formHelperTextClassName, 'text-primary'),
            )
          : null}
        <fieldset
          disabled={isFieldsetDisabled}
          className="contents border-0 p-0 m-0"
        >
          {children}
        </fieldset>
      </form>
    </FormContext.Provider>
  );
};

Form.displayName = 'Form';
