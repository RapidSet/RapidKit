import { forwardRef } from 'react';
import { Button } from '@components/Button';
import { useFormContext } from './FormContext';
import type { FormSubmitProps } from './types';

export const FormSubmit = forwardRef<HTMLButtonElement, FormSubmitProps>(
  (props, ref) => {
    const {
      type = 'submit',
      disabled,
      loadingWhenSubmitting = true,
      disableWhenSubmitting = true,
      ...rest
    } = props;
    const { isSubmitting } = useFormContext();

    const isLoading = loadingWhenSubmitting && isSubmitting;
    const isDisabled =
      Boolean(disabled) || (disableWhenSubmitting && isSubmitting);

    return (
      <Button
        ref={ref}
        type={type}
        loading={isLoading}
        disabled={isDisabled}
        {...rest}
      />
    );
  },
);

FormSubmit.displayName = 'FormSubmit';
