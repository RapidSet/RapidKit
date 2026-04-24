import type * as React from 'react';

export type FormValues = Record<string, unknown>;

export type FormErrors<TValues extends FormValues> = Partial<
  Record<keyof TValues, string>
>;

export type FormTouched<TValues extends FormValues> = Partial<
  Record<keyof TValues, boolean>
>;

export type FormFieldElement =
  | HTMLInputElement
  | HTMLTextAreaElement
  | HTMLSelectElement;

export type FormFieldChangeEvent = React.ChangeEvent<FormFieldElement>;

export type FormFieldChangeHandler = (event: FormFieldChangeEvent) => void;

export type FormFieldBlurEvent = React.FocusEvent<FormFieldElement>;

export type FormFieldBlurHandler = (event: FormFieldBlurEvent) => void;

export type FormSubmitEventLike = {
  preventDefault: () => void;
};

export type FormSchemaIssuePathSegment = string | number;

export type FormSchemaIssue = {
  path: FormSchemaIssuePathSegment[];
  message: string;
};

export type FormSchemaSafeParseResult =
  | {
      success: true;
      data: unknown;
    }
  | {
      success: false;
      error: {
        issues: FormSchemaIssue[];
      };
    };

export type FormValidationSchema = {
  safeParse: (values: unknown) => FormSchemaSafeParseResult;
};

export type BooleanFieldKey<TValues extends FormValues> = {
  [TKey in keyof TValues]-?: TValues[TKey] extends boolean ? TKey : never;
}[keyof TValues];

export type GetFieldErrorOptions = {
  showUntouched?: boolean;
};

export type TextFieldBinding<
  TValues extends FormValues,
  TKey extends keyof TValues,
> = {
  name: string;
  value: TValues[TKey];
  onChange: FormFieldChangeHandler;
  onBlur: () => void;
  error?: string;
};

export type CheckboxFieldBinding = {
  name: string;
  checked: boolean;
  onCheckChange: (checked: boolean) => void;
  onBlur: () => void;
  error?: string;
};

export type UseFormHandlersSubmitHelpers<TValues extends FormValues> = {
  resetForm: (nextValues?: TValues) => void;
  setErrors: React.Dispatch<React.SetStateAction<FormErrors<TValues>>>;
  setTouched: React.Dispatch<React.SetStateAction<FormTouched<TValues>>>;
  setValues: React.Dispatch<React.SetStateAction<TValues>>;
};

export type UseFormHandlersOptions<TValues extends FormValues> = {
  initialValues: TValues;
  initialErrors?: FormErrors<TValues>;
  initialTouched?: FormTouched<TValues>;
  schema?: FormValidationSchema;
  validate?: (values: TValues) => FormErrors<TValues>;
  onSubmit?: (
    values: TValues,
    helpers: UseFormHandlersSubmitHelpers<TValues>,
  ) => void | Promise<void>;
};

export type UseFormHandlersReturn<TValues extends FormValues> = {
  values: TValues;
  errors: FormErrors<TValues>;
  touched: FormTouched<TValues>;
  isDirty: boolean;
  setFieldValue: <TKey extends keyof TValues>(
    field: TKey,
    value: TValues[TKey],
  ) => void;
  setFieldError: <TKey extends keyof TValues>(
    field: TKey,
    error?: string,
  ) => void;
  clearFieldError: <TKey extends keyof TValues>(field: TKey) => void;
  getFieldValue: <TKey extends keyof TValues>(field: TKey) => TValues[TKey];
  getFieldError: <TKey extends keyof TValues>(
    field: TKey,
    options?: GetFieldErrorOptions,
  ) => string | undefined;
  handleFieldChange: {
    <TKey extends keyof TValues>(field: TKey, value: TValues[TKey]): void;
    (event: FormFieldChangeEvent): void;
  };
  createChangeHandler: <TKey extends keyof TValues>(
    field: TKey,
  ) => FormFieldChangeHandler;
  handleFieldBlur: (field: keyof TValues) => void;
  handleFieldBlurEvent: FormFieldBlurHandler;
  createBlurHandler: <TKey extends keyof TValues>(field: TKey) => () => void;
  getTextFieldProps: <TKey extends keyof TValues>(
    field: TKey,
    options?: GetFieldErrorOptions,
  ) => TextFieldBinding<TValues, TKey>;
  getCheckboxFieldProps: <TKey extends BooleanFieldKey<TValues>>(
    field: TKey,
    options?: GetFieldErrorOptions,
  ) => CheckboxFieldBinding;
  resetForm: (nextValues?: TValues) => void;
  handleSubmit: (event?: FormSubmitEventLike) => Promise<boolean>;
};
