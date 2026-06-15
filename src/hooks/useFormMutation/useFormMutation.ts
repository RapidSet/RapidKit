import { useState } from 'react';
import { useFormHandlers } from '../useFormHandlers';
import type { FormErrors, FormTouched, FormValues } from '../useFormHandlers';
import type {
  FormMutationMappedError,
  UseFormMutationOptions,
  UseFormMutationReturn,
} from './types';

const extractDefaultMessage = (err: unknown): string => {
  if (typeof err === 'object' && err !== null) {
    const candidate = err as Record<string, unknown>;
    const data = candidate.data;
    if (typeof data === 'object' && data !== null && 'message' in data) {
      const msg = (data as { message: unknown }).message;
      if (typeof msg === 'string' && msg.length > 0) {
        return msg;
      }
    }
    if (typeof candidate.message === 'string' && candidate.message.length > 0) {
      return candidate.message;
    }
    if (typeof candidate.error === 'string' && candidate.error.length > 0) {
      return candidate.error;
    }
  }
  return 'Something went wrong. Please try again.';
};

/**
 * Composes `useFormHandlers` with an RTK Query mutation hook.
 *
 * The mutation is invoked on submit; server-side failures are routed back into
 * field errors via `mapError`, or — when no mapper is provided — surfaced as a
 * form-level `serverError` string using a structural fallback extractor.
 *
 * @typeParam TValues - Shape of the form values.
 * @typeParam TArg - Shape of the mutation argument (defaults to TValues).
 * @typeParam TResponse - Shape of the mutation response.
 */
export const useFormMutation = <
  TValues extends FormValues,
  TArg = TValues,
  TResponse = unknown,
>(
  options: UseFormMutationOptions<TValues, TArg, TResponse>,
): UseFormMutationReturn<TValues, TResponse> => {
  const {
    mutation,
    toRequest,
    mapError,
    onSuccess,
    onError,
    resetOnSuccess,
    ...formOptions
  } = options;

  const [trigger, result] = mutation();
  const [serverError, setServerError] = useState<string | undefined>(undefined);
  const [lastResponse, setLastResponse] = useState<TResponse | undefined>(
    undefined,
  );

  const applyMappedError = (
    mapped: FormMutationMappedError<TValues>,
    helpers: {
      setErrors: React.Dispatch<React.SetStateAction<FormErrors<TValues>>>;
      setTouched: React.Dispatch<React.SetStateAction<FormTouched<TValues>>>;
    },
    fallback: unknown,
  ) => {
    if (typeof mapped === 'string') {
      setServerError(mapped);
      return;
    }

    if (mapped && typeof mapped === 'object') {
      if (mapped.formError) {
        setServerError(mapped.formError);
      }
      if (mapped.fieldErrors) {
        const fieldErrors = mapped.fieldErrors;
        helpers.setErrors((previous) => ({ ...previous, ...fieldErrors }));
        helpers.setTouched((previous) => {
          const next: FormTouched<TValues> = { ...previous };
          (Object.keys(fieldErrors) as Array<keyof TValues>).forEach((key) => {
            next[key] = true;
          });
          return next;
        });
      }
      if (!mapped.formError && !mapped.fieldErrors) {
        setServerError(extractDefaultMessage(fallback));
      }
      return;
    }

    setServerError(extractDefaultMessage(fallback));
  };

  const form = useFormHandlers<TValues>({
    ...formOptions,
    onSubmit: async (values, helpers) => {
      setServerError(undefined);
      try {
        const arg = toRequest ? toRequest(values) : (values as unknown as TArg);
        const data = await trigger(arg).unwrap();
        setLastResponse(data);
        if (resetOnSuccess) {
          helpers.resetForm();
        }
        await onSuccess?.(data, values);
      } catch (err) {
        const mapped = mapError ? mapError(err) : undefined;
        applyMappedError(
          mapped,
          { setErrors: helpers.setErrors, setTouched: helpers.setTouched },
          err,
        );
        onError?.(err);
      }
    },
  });

  return {
    ...form,
    isSubmitting: Boolean(result.isLoading),
    serverError,
    lastResponse,
  };
};
