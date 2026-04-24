import { act, renderHook } from '@testing-library/react';
import type * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { useFormHandlers } from './useFormHandlers';
import type { FormValidationSchema } from './types';

type LoginFormValues = {
  email: string;
  remember: boolean;
};

const initialValues: LoginFormValues = {
  email: '',
  remember: false,
};

describe('useFormHandlers', () => {
  it('initializes with provided values', () => {
    const { result } = renderHook(() =>
      useFormHandlers({
        initialValues,
      }),
    );

    expect(result.current.values).toEqual(initialValues);
    expect(result.current.errors).toEqual({});
    expect(result.current.touched).toEqual({});
    expect(result.current.isDirty).toBe(false);
  });

  it('updates field values using direct field/value inputs', () => {
    const { result } = renderHook(() =>
      useFormHandlers({
        initialValues,
      }),
    );

    act(() => {
      result.current.handleFieldChange('email', 'dev@rapidset.com');
    });

    expect(result.current.values.email).toBe('dev@rapidset.com');
    expect(result.current.isDirty).toBe(true);
  });

  it('updates values from native input events', () => {
    const { result } = renderHook(() =>
      useFormHandlers({
        initialValues,
      }),
    );

    act(() => {
      result.current.handleFieldChange({
        target: {
          name: 'email',
          value: 'user@example.com',
        },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    act(() => {
      result.current.handleFieldChange({
        target: {
          name: 'remember',
          type: 'checkbox',
          checked: true,
          value: 'on',
        },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.values.email).toBe('user@example.com');
    expect(result.current.values.remember).toBe(true);
  });

  it('marks fields as touched through blur handlers', () => {
    const { result } = renderHook(() =>
      useFormHandlers({
        initialValues,
      }),
    );

    act(() => {
      result.current.handleFieldBlur('email');
    });

    act(() => {
      result.current.createBlurHandler('remember')();
    });

    expect(result.current.touched.email).toBe(true);
    expect(result.current.touched.remember).toBe(true);
  });

  it('marks touched through native blur event using element name', () => {
    const { result } = renderHook(() =>
      useFormHandlers({
        initialValues,
      }),
    );

    act(() => {
      result.current.handleFieldBlurEvent({
        target: {
          name: 'email',
        },
      } as React.FocusEvent<HTMLInputElement>);
    });

    expect(result.current.touched.email).toBe(true);
  });

  it('sets and clears field errors', () => {
    const { result } = renderHook(() =>
      useFormHandlers({
        initialValues,
      }),
    );

    act(() => {
      result.current.setFieldError('email', 'Email is required');
    });

    expect(result.current.errors.email).toBe('Email is required');

    act(() => {
      result.current.clearFieldError('email');
    });

    expect(result.current.errors.email).toBeUndefined();
  });

  it('maps text field value and error by field name', () => {
    const { result } = renderHook(() =>
      useFormHandlers({
        initialValues,
      }),
    );

    act(() => {
      result.current.setFieldValue('email', 'name-mapped@rapidset.com');
      result.current.setFieldError('email', 'Email is invalid');
    });

    const beforeTouch = result.current.getTextFieldProps('email');
    expect(beforeTouch.name).toBe('email');
    expect(beforeTouch.value).toBe('name-mapped@rapidset.com');
    expect(beforeTouch.error).toBeUndefined();

    act(() => {
      beforeTouch.onBlur();
    });

    const afterTouch = result.current.getTextFieldProps('email');
    expect(afterTouch.error).toBe('Email is invalid');
    expect(result.current.getFieldError('email', { showUntouched: true })).toBe(
      'Email is invalid',
    );
  });

  it('maps checkbox state by field name', () => {
    const { result } = renderHook(() =>
      useFormHandlers({
        initialValues,
      }),
    );

    const rememberProps = result.current.getCheckboxFieldProps('remember');
    expect(rememberProps.name).toBe('remember');
    expect(rememberProps.checked).toBe(false);

    act(() => {
      rememberProps.onCheckChange(true);
    });

    expect(result.current.getFieldValue('remember')).toBe(true);

    act(() => {
      rememberProps.onBlur();
    });

    expect(result.current.touched.remember).toBe(true);
  });

  it('blocks submit and sets touched fields when validation fails', async () => {
    const onSubmit = vi.fn();

    const { result } = renderHook(() =>
      useFormHandlers({
        initialValues,
        validate: (values) =>
          values.email ? {} : { email: 'Email is required' },
        onSubmit,
      }),
    );

    let wasSubmitted = true;
    await act(async () => {
      wasSubmitted = await result.current.handleSubmit();
    });

    expect(wasSubmitted).toBe(false);
    expect(result.current.errors.email).toBe('Email is required');
    expect(result.current.touched.email).toBe(true);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('supports schema.safeParse validation for zod-compatible schemas', async () => {
    const onSubmit = vi.fn();

    const schema: FormValidationSchema = {
      safeParse: (values) => {
        const candidate = values as LoginFormValues;

        if (!candidate.email.includes('@')) {
          return {
            success: false,
            error: {
              issues: [
                {
                  path: ['email'],
                  message: 'Email must be valid',
                },
              ],
            },
          };
        }

        return {
          success: true,
          data: candidate,
        };
      },
    };

    const { result } = renderHook(() =>
      useFormHandlers({
        initialValues,
        schema,
        onSubmit,
      }),
    );

    let submitted = true;
    await act(async () => {
      submitted = await result.current.handleSubmit();
    });

    expect(submitted).toBe(false);
    expect(result.current.errors.email).toBe('Email must be valid');
    expect(result.current.touched.email).toBe(true);
    expect(onSubmit).not.toHaveBeenCalled();

    act(() => {
      result.current.setFieldValue('email', 'valid@rapidset.com');
    });

    await act(async () => {
      submitted = await result.current.handleSubmit();
    });

    expect(submitted).toBe(true);
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('merges schema and validate errors with validate taking precedence', async () => {
    const { result } = renderHook(() =>
      useFormHandlers({
        initialValues,
        schema: {
          safeParse: () => ({
            success: false,
            error: {
              issues: [
                {
                  path: ['email'],
                  message: 'Schema email message',
                },
              ],
            },
          }),
        },
        validate: () => ({
          email: 'Custom validate message',
        }),
      }),
    );

    let submitted = true;
    await act(async () => {
      submitted = await result.current.handleSubmit();
    });

    expect(submitted).toBe(false);
    expect(result.current.errors.email).toBe('Custom validate message');
  });

  it('submits values when valid', async () => {
    const onSubmit = vi.fn();

    const { result } = renderHook(() =>
      useFormHandlers({
        initialValues,
        onSubmit,
      }),
    );

    act(() => {
      result.current.setFieldValue('email', 'ready@rapidset.com');
    });

    let submitted = false;
    await act(async () => {
      submitted = await result.current.handleSubmit();
    });

    expect(submitted).toBe(true);
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith(
      {
        email: 'ready@rapidset.com',
        remember: false,
      },
      expect.objectContaining({
        resetForm: expect.any(Function),
        setErrors: expect.any(Function),
        setTouched: expect.any(Function),
        setValues: expect.any(Function),
      }),
    );
  });

  it('resets values and form state', () => {
    const { result } = renderHook(() =>
      useFormHandlers({
        initialValues,
      }),
    );

    act(() => {
      result.current.setFieldValue('email', 'changed@rapidset.com');
      result.current.setFieldError('email', 'Needs a valid email');
      result.current.handleFieldBlur('email');
    });

    act(() => {
      result.current.resetForm();
    });

    expect(result.current.values).toEqual(initialValues);
    expect(result.current.errors).toEqual({});
    expect(result.current.touched).toEqual({});
    expect(result.current.isDirty).toBe(false);
  });
});
