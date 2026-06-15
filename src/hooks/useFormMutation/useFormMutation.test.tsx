import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { FormValidationSchema } from '../useFormHandlers';
import { useFormMutation } from './useFormMutation';
import type { FormMutationHookTuple } from './types';

type LoginValues = {
  email: string;
  password: string;
};

type LoginResponse = { token: string };

const initialValues: LoginValues = { email: '', password: '' };

const makeMutation = <TArg, TResponse>(
  unwrap: () => Promise<TResponse>,
  result: { isLoading?: boolean; isError?: boolean; isSuccess?: boolean } = {},
): {
  hook: () => FormMutationHookTuple<TArg, TResponse>;
  trigger: ReturnType<typeof vi.fn>;
} => {
  const trigger = vi.fn(() => ({ unwrap }));
  const hook = () =>
    [trigger, result] as unknown as FormMutationHookTuple<TArg, TResponse>;
  return { hook, trigger };
};

describe('useFormMutation', () => {
  it('calls the mutation trigger with values when no toRequest is provided', async () => {
    const { hook, trigger } = makeMutation(() =>
      Promise.resolve({ token: 'ok' }),
    );

    const { result } = renderHook(() =>
      useFormMutation<LoginValues, LoginValues, LoginResponse>({
        initialValues: { email: 'a@b.io', password: 'secret' },
        mutation: hook,
      }),
    );

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(trigger).toHaveBeenCalledTimes(1);
    expect(trigger).toHaveBeenCalledWith({
      email: 'a@b.io',
      password: 'secret',
    });
    expect(result.current.lastResponse).toEqual({ token: 'ok' });
  });

  it('passes the transformed payload from toRequest', async () => {
    const { hook, trigger } = makeMutation(() =>
      Promise.resolve({ token: 'ok' }),
    );

    const { result } = renderHook(() =>
      useFormMutation<LoginValues, { e: string }, LoginResponse>({
        initialValues: { email: 'a@b.io', password: 'secret' },
        mutation: hook,
        toRequest: (values) => ({ e: values.email }),
      }),
    );

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(trigger).toHaveBeenCalledWith({ e: 'a@b.io' });
  });

  it('mirrors result.isLoading into isSubmitting', () => {
    const { hook } = makeMutation(() => Promise.resolve({ token: 'ok' }), {
      isLoading: true,
    });

    const { result } = renderHook(() =>
      useFormMutation<LoginValues>({
        initialValues,
        mutation: hook,
      }),
    );

    expect(result.current.isSubmitting).toBe(true);
  });

  it('invokes onSuccess with response and values, and resets when configured', async () => {
    const onSuccess = vi.fn();
    const { hook } = makeMutation(() => Promise.resolve({ token: 'ok' }));

    const { result } = renderHook(() =>
      useFormMutation<LoginValues, LoginValues, LoginResponse>({
        initialValues: { email: 'me@x.io', password: 'pw' },
        mutation: hook,
        onSuccess,
        resetOnSuccess: true,
      }),
    );

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onSuccess).toHaveBeenCalledWith(
      { token: 'ok' },
      { email: 'me@x.io', password: 'pw' },
    );
    expect(result.current.values).toEqual({ email: 'me@x.io', password: 'pw' });
  });

  it('maps fieldErrors back to form.errors and flips touched flags', async () => {
    const { hook } = makeMutation(() =>
      Promise.reject({ data: { fieldErrors: { password: 'too weak' } } }),
    );

    const { result } = renderHook(() =>
      useFormMutation<LoginValues>({
        initialValues: { email: 'me@x.io', password: 'short' },
        mutation: hook,
        mapError: (err) => {
          const candidate = err as {
            data?: { fieldErrors?: { password?: string } };
          };
          return { fieldErrors: candidate.data?.fieldErrors };
        },
      }),
    );

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(result.current.errors.password).toBe('too weak');
    expect(result.current.touched.password).toBe(true);
    expect(result.current.serverError).toBeUndefined();
  });

  it('routes formError from mapError into serverError', async () => {
    const { hook } = makeMutation(() => Promise.reject(new Error('nope')));

    const { result } = renderHook(() =>
      useFormMutation<LoginValues>({
        initialValues: { email: 'me@x.io', password: 'pw' },
        mutation: hook,
        mapError: () => ({ formError: 'Server unavailable' }),
      }),
    );

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(result.current.serverError).toBe('Server unavailable');
  });

  it('routes a string return from mapError into serverError', async () => {
    const { hook } = makeMutation(() => Promise.reject(new Error('nope')));

    const { result } = renderHook(() =>
      useFormMutation<LoginValues>({
        initialValues,
        mutation: hook,
        mapError: () => 'Direct string error',
      }),
    );

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(result.current.serverError).toBe('Direct string error');
  });

  it('uses default extractor when mapError is omitted', async () => {
    const { hook } = makeMutation(() =>
      Promise.reject({ data: { message: 'Backend boom' } }),
    );

    const { result } = renderHook(() =>
      useFormMutation<LoginValues>({
        initialValues,
        mutation: hook,
      }),
    );

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(result.current.serverError).toBe('Backend boom');
  });

  it('falls back to a generic message when no shape matches', async () => {
    const { hook } = makeMutation(() => Promise.reject({ status: 500 }));

    const { result } = renderHook(() =>
      useFormMutation<LoginValues>({
        initialValues,
        mutation: hook,
      }),
    );

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(result.current.serverError).toBe(
      'Something went wrong. Please try again.',
    );
  });

  it('does not call the mutation when schema validation fails', async () => {
    const schema: FormValidationSchema = {
      safeParse: () => ({
        success: false,
        error: {
          issues: [{ path: ['email'], message: 'Email is required' }],
        },
      }),
    };

    const { hook, trigger } = makeMutation(() =>
      Promise.resolve({ token: 'ok' }),
    );

    const { result } = renderHook(() =>
      useFormMutation<LoginValues>({
        initialValues,
        mutation: hook,
        schema,
      }),
    );

    let submitted = true;
    await act(async () => {
      submitted = await result.current.handleSubmit();
    });

    expect(submitted).toBe(false);
    expect(trigger).not.toHaveBeenCalled();
    expect(result.current.errors.email).toBe('Email is required');
  });

  it('clears serverError at the start of a new submit', async () => {
    let nextResult: LoginResponse | Error = new Error('first failure');
    const { hook } = makeMutation(() =>
      nextResult instanceof Error
        ? Promise.reject(nextResult)
        : Promise.resolve(nextResult),
    );

    const { result } = renderHook(() =>
      useFormMutation<LoginValues>({
        initialValues: { email: 'me@x.io', password: 'pw' },
        mutation: hook,
        mapError: () => 'failed',
      }),
    );

    await act(async () => {
      await result.current.handleSubmit();
    });
    expect(result.current.serverError).toBe('failed');

    nextResult = { token: 'ok' };
    await act(async () => {
      await result.current.handleSubmit();
    });
    expect(result.current.serverError).toBeUndefined();
    expect(result.current.lastResponse).toEqual({ token: 'ok' });
  });

  it('invokes onError on failure', async () => {
    const onError = vi.fn();
    const { hook } = makeMutation(() => Promise.reject(new Error('boom')));

    const { result } = renderHook(() =>
      useFormMutation<LoginValues>({
        initialValues: { email: 'me@x.io', password: 'pw' },
        mutation: hook,
        onError,
      }),
    );

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(onError).toHaveBeenCalledTimes(1);
  });
});
