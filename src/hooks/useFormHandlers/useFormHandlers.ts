import { useCallback, useMemo, useRef, useState } from 'react';
import type {
  BooleanFieldKey,
  CheckboxFieldBinding,
  FormErrors,
  FormFieldChangeEvent,
  FormFieldBlurEvent,
  FormSchemaIssue,
  FormSubmitEventLike,
  FormValidationSchema,
  FormValues,
  GetFieldErrorOptions,
  FormTouched,
  TextFieldBinding,
  UseFormHandlersOptions,
  UseFormHandlersReturn,
  UseFormHandlersSubmitHelpers,
} from './types';

const areValuesShallowEqual = <TValues extends FormValues>(
  left: TValues,
  right: TValues,
) => {
  const leftKeys = Object.keys(left);
  const rightKeys = Object.keys(right);

  if (leftKeys.length !== rightKeys.length) {
    return false;
  }

  return leftKeys.every(
    (key) => left[key as keyof TValues] === right[key as keyof TValues],
  );
};

const readEventValue = (event: FormFieldChangeEvent): unknown => {
  const target = event.target;

  if (
    typeof target === 'object' &&
    target !== null &&
    'type' in target &&
    target.type === 'checkbox' &&
    'checked' in target
  ) {
    return Boolean(target.checked);
  }

  return target.value;
};

const getSchemaIssueFieldKey = <TValues extends FormValues>(
  issue: FormSchemaIssue,
): keyof TValues | null => {
  if (issue.path.length === 0) {
    return null;
  }

  const [firstSegment] = issue.path;
  if (typeof firstSegment !== 'string') {
    return null;
  }

  return firstSegment as keyof TValues;
};

const getSchemaErrors = <TValues extends FormValues>(
  schema: FormValidationSchema | undefined,
  values: TValues,
): FormErrors<TValues> => {
  if (!schema) {
    return {};
  }

  const result = schema.safeParse(values);
  if (result.success) {
    return {};
  }

  return result.error.issues.reduce<FormErrors<TValues>>(
    (accumulated, issue) => {
      const fieldKey = getSchemaIssueFieldKey<TValues>(issue);
      if (!fieldKey) {
        return accumulated;
      }

      if (accumulated[fieldKey]) {
        return accumulated;
      }

      return {
        ...accumulated,
        [fieldKey]: issue.message,
      };
    },
    {},
  );
};

/**
 * Manages common form state and handlers for controlled form workflows.
 *
 * Features:
 * - Field value, touched, and error state management.
 * - Native change event handling for input, textarea, and select elements.
 * - Native blur event handling based on element `name`.
 * - Checkbox value extraction via `checked` to preserve boolean values.
 * - Name-based binding helpers for component composition (`getTextFieldProps`
 *   and `getCheckboxFieldProps`).
 * - Validation using either a schema with `safeParse` (Zod-compatible), a custom
 *   `validate` callback, or both.
 *
 * Validation precedence:
 * - When both `schema` and `validate` are provided, errors are merged and
 *   `validate` errors override schema errors for the same field.
 *
 * @typeParam TValues - Object shape representing all form field values.
 * @param options - Hook configuration including initial state, validation, and submit handler.
 * @returns Form state and helper handlers for value updates, blur handling, validation, reset, and submit.
 */
export const useFormHandlers = <TValues extends FormValues>(
  options: UseFormHandlersOptions<TValues>,
): UseFormHandlersReturn<TValues> => {
  const {
    initialValues,
    initialErrors = {},
    initialTouched = {},
    schema,
    validate,
    onSubmit,
  } = options;

  const initialValuesRef = useRef(initialValues);
  const [values, setValues] = useState<TValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors<TValues>>(initialErrors);
  const [touched, setTouched] = useState<FormTouched<TValues>>(initialTouched);

  const setFieldValue = useCallback(
    <TKey extends keyof TValues>(field: TKey, value: TValues[TKey]) => {
      setValues((previousValues) => ({
        ...previousValues,
        [field]: value,
      }));
    },
    [],
  );

  const setFieldError = useCallback(
    <TKey extends keyof TValues>(field: TKey, error?: string) => {
      setErrors((previousErrors) => {
        if (!error) {
          if (Object.hasOwn(previousErrors, field) === false) {
            return previousErrors;
          }

          const nextErrors = { ...previousErrors };
          delete nextErrors[field];
          return nextErrors;
        }

        return {
          ...previousErrors,
          [field]: error,
        };
      });
    },
    [],
  );

  const clearFieldError = useCallback(
    <TKey extends keyof TValues>(field: TKey) => {
      setFieldError(field);
    },
    [setFieldError],
  );

  const getFieldValue = useCallback(
    <TKey extends keyof TValues>(field: TKey) => values[field],
    [values],
  );

  const getFieldError = useCallback(
    <TKey extends keyof TValues>(
      field: TKey,
      options?: GetFieldErrorOptions,
    ) => {
      if (!options?.showUntouched && !touched[field]) {
        return undefined;
      }

      return errors[field];
    },
    [errors, touched],
  );

  const handleFieldChange = useCallback(
    <TKey extends keyof TValues>(
      fieldOrEvent: TKey | FormFieldChangeEvent,
      nextValue?: TValues[TKey],
    ) => {
      if (typeof fieldOrEvent === 'object' && fieldOrEvent !== null) {
        const event = fieldOrEvent;
        const fieldName = event.target.name as keyof TValues;

        if (!fieldName) {
          return;
        }

        setFieldValue(
          fieldName,
          readEventValue(event) as TValues[keyof TValues],
        );
        return;
      }

      if (nextValue === undefined) {
        return;
      }

      setFieldValue(fieldOrEvent, nextValue);
    },
    [setFieldValue],
  );

  const createChangeHandler = useCallback(
    <TKey extends keyof TValues>(field: TKey) =>
      (event: FormFieldChangeEvent) => {
        setFieldValue(field, readEventValue(event) as TValues[TKey]);
      },
    [setFieldValue],
  );

  const handleFieldBlur = useCallback((field: keyof TValues) => {
    setTouched((previousTouched) => ({
      ...previousTouched,
      [field]: true,
    }));
  }, []);

  const handleFieldBlurEvent = useCallback(
    (event: FormFieldBlurEvent) => {
      const fieldName = event.target.name as keyof TValues;
      if (!fieldName) {
        return;
      }

      handleFieldBlur(fieldName);
    },
    [handleFieldBlur],
  );

  const createBlurHandler = useCallback(
    <TKey extends keyof TValues>(field: TKey) =>
      () => {
        handleFieldBlur(field);
      },
    [handleFieldBlur],
  );

  const getTextFieldProps = useCallback(
    <TKey extends keyof TValues>(
      field: TKey,
      options?: GetFieldErrorOptions,
    ): TextFieldBinding<TValues, TKey> => ({
      name: String(field),
      value: getFieldValue(field),
      onChange: handleFieldChange,
      onBlur: createBlurHandler(field),
      error: getFieldError(field, options),
    }),
    [createBlurHandler, getFieldError, getFieldValue, handleFieldChange],
  );

  const getCheckboxFieldProps = useCallback(
    <TKey extends BooleanFieldKey<TValues>>(
      field: TKey,
      options?: GetFieldErrorOptions,
    ): CheckboxFieldBinding => ({
      name: String(field),
      checked: Boolean(getFieldValue(field)),
      onCheckChange: (checked: boolean) => {
        setFieldValue(field, checked as TValues[TKey]);
      },
      onBlur: createBlurHandler(field),
      error: getFieldError(field, options),
    }),
    [createBlurHandler, getFieldError, getFieldValue, setFieldValue],
  );

  const resetForm = useCallback((nextValues?: TValues) => {
    const resolvedValues = nextValues ?? initialValuesRef.current;

    if (nextValues) {
      initialValuesRef.current = nextValues;
    }

    setValues(resolvedValues);
    setErrors({});
    setTouched({});
  }, []);

  const submitHelpers = useMemo<UseFormHandlersSubmitHelpers<TValues>>(
    () => ({
      resetForm,
      setErrors,
      setTouched,
      setValues,
    }),
    [resetForm],
  );

  const handleSubmit = useCallback(
    async (event?: FormSubmitEventLike) => {
      event?.preventDefault();

      const schemaErrors = getSchemaErrors(schema, values);
      const validateErrors = validate?.(values) ?? {};
      const nextErrors = {
        ...schemaErrors,
        ...validateErrors,
      };
      setErrors(nextErrors);

      const hasError = Object.keys(nextErrors).length > 0;
      if (hasError) {
        setTouched((previousTouched) => {
          const errorTouched = Object.keys(nextErrors).reduce<
            FormTouched<TValues>
          >((accumulated, key) => {
            accumulated[key as keyof TValues] = true;
            return accumulated;
          }, {});

          return {
            ...previousTouched,
            ...errorTouched,
          };
        });

        return false;
      }

      await onSubmit?.(values, submitHelpers);
      return true;
    },
    [onSubmit, schema, submitHelpers, validate, values],
  );

  const isDirty = useMemo(
    () => areValuesShallowEqual(values, initialValuesRef.current) === false,
    [values],
  );

  return {
    values,
    errors,
    touched,
    isDirty,
    setFieldValue,
    setFieldError,
    clearFieldError,
    getFieldValue,
    getFieldError,
    handleFieldChange,
    createChangeHandler,
    handleFieldBlur,
    handleFieldBlurEvent,
    createBlurHandler,
    getTextFieldProps,
    getCheckboxFieldProps,
    resetForm,
    handleSubmit,
  };
};
