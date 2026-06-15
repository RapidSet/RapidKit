import {
  Children,
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cn } from '@lib/utils';
import { formInfoTextClassName } from '@lib/feedbackText';
import type {
  CheckboxFieldBinding,
  TextFieldBinding,
} from '@/hooks/useFormHandlers';
import { useFormContext } from './FormContext';
import { buildFieldId, resolveFieldKind } from './helpers';
import type {
  FormFieldChildRenderer,
  FormFieldProps,
  FormFieldRenderArgs,
} from './types';

const buildRenderArgs = (params: {
  fieldKind: 'text' | 'checkbox';
  textBinding: TextFieldBinding<Record<string, unknown>, string>;
  checkboxBinding: CheckboxFieldBinding;
  name: string;
  id: string;
  required: boolean | undefined;
  disabled: boolean;
  errorMessage: string | undefined;
}): FormFieldRenderArgs => {
  const {
    fieldKind,
    textBinding,
    checkboxBinding,
    name,
    id,
    required,
    disabled,
    errorMessage,
  } = params;

  return {
    name,
    value: textBinding.value,
    checked:
      fieldKind === 'checkbox'
        ? checkboxBinding.checked
        : Boolean(textBinding.value),
    onChange: textBinding.onChange,
    onCheckChange: checkboxBinding.onCheckChange,
    onBlur: textBinding.onBlur,
    error: errorMessage,
    required,
    disabled,
    id,
  };
};

export const FormField = (props: FormFieldProps) => {
  const {
    name,
    label,
    helperText,
    description,
    infoText,
    required,
    error: errorOverride,
    className,
    as,
    showUntouchedError,
    children,
  } = props;

  const { form, isSubmitting, disableOnSubmit, formId } = useFormContext();
  const fieldKind = resolveFieldKind(form.values[name], as);
  const id = buildFieldId(formId, name);
  const disabled = isSubmitting && disableOnSubmit;

  const textBinding = form.getTextFieldProps(name, {
    showUntouched: showUntouchedError,
  }) as TextFieldBinding<Record<string, unknown>, string>;

  const checkboxBinding = form.getCheckboxFieldProps(name as never, {
    showUntouched: showUntouchedError,
  });

  const computedError =
    errorOverride ??
    (fieldKind === 'checkbox' ? checkboxBinding.error : textBinding.error);

  const renderWrapper = (content: ReactNode) => (
    <div className={cn('space-y-1', className)} data-rk-form-field={name}>
      {description ? (
        <p className={cn(formInfoTextClassName, 'mb-1')}>{description}</p>
      ) : null}
      {content}
    </div>
  );

  if (typeof children === 'function') {
    const renderer = children as FormFieldChildRenderer;
    return renderWrapper(
      renderer(
        buildRenderArgs({
          fieldKind,
          textBinding,
          checkboxBinding,
          name,
          id,
          required,
          disabled,
          errorMessage: computedError,
        }),
      ),
    );
  }

  const onlyChild = Children.only(children);
  if (!isValidElement(onlyChild)) {
    throw new Error(
      'FormField expects a single React element or a render function as its child.',
    );
  }

  const childElement = onlyChild as ReactElement<Record<string, unknown>>;
  const childProps = (childElement.props ?? {}) as Record<string, unknown>;

  const chromeProps: Record<string, unknown> = {
    label,
    helperText,
    infoText,
    required,
    id,
    disabled,
  };

  const injectedBinding: Record<string, unknown> =
    fieldKind === 'checkbox'
      ? {
          name,
          checked: checkboxBinding.checked,
          onCheckChange: checkboxBinding.onCheckChange,
          onBlur: checkboxBinding.onBlur,
          error: computedError,
        }
      : {
          name,
          value: textBinding.value,
          onChange: textBinding.onChange,
          onBlur: textBinding.onBlur,
          error: computedError,
        };

  const mergedProps = {
    ...chromeProps,
    ...childProps,
    ...injectedBinding,
  };

  return renderWrapper(cloneElement(childElement, mergedProps));
};

FormField.displayName = 'FormField';
