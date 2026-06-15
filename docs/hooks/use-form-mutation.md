# useFormMutation

`useFormMutation` composes [`useFormHandlers`](./use-form-handlers.md) with an RTK Query mutation hook. It triggers the mutation on submit, maps server failures back into field or form errors, exposes `isSubmitting`, and surfaces the last response.

The mutation type is structural — `useFormMutation` does not import `@reduxjs/toolkit/query` at runtime, so the package stays type-only-aware of RTK Query.

## Basic Usage

```tsx
import {
  Form,
  FormField,
  FormSubmit,
  Input,
  useFormMutation,
} from '@rapidset/rapidkit';
import { z } from 'zod';
import { useLoginMutation } from '@/api/auth';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginPage() {
  const form = useFormMutation<LoginValues, LoginValues, { token: string }>({
    initialValues: { email: '', password: '' },
    schema: loginSchema,
    mutation: useLoginMutation,
    mapError: (err) => {
      const candidate = err as {
        data?: { fieldErrors?: Record<string, string> };
      };
      return { fieldErrors: candidate.data?.fieldErrors };
    },
    onSuccess: () => {
      // navigate, toast, etc.
    },
    resetOnSuccess: false,
  });

  return (
    <Form
      form={form}
      isSubmitting={form.isSubmitting}
      serverError={form.serverError}
    >
      <FormField name="email" label="Email" required>
        <Input type="email" />
      </FormField>
      <FormField name="password" label="Password" required>
        <Input type="password" />
      </FormField>
      <FormSubmit label="Sign In" />
    </Form>
  );
}
```

## Options

- `initialValues`, `initialErrors?`, `initialTouched?`, `schema?`, `validate?` — passed straight through to `useFormHandlers`.
- `mutation: () => readonly [trigger, result]` — pass the RTK Query mutation hook itself (e.g., `useLoginMutation`). Called once per render to obtain the trigger and result.
- `toRequest?: (values) => TArg` — transform values into the mutation argument. Defaults to identity.
- `mapError?: (err) => MappedError | string | undefined` — convert server errors into structured field/form errors. See below.
- `onSuccess?: (data, values) => void | Promise<void>`.
- `onError?: (err) => void`.
- `resetOnSuccess?: boolean` — call `form.resetForm()` before `onSuccess` runs.

## Return shape

Everything `useFormHandlers` returns, plus:

- `isSubmitting: boolean` — mirrors `result.isLoading` from the mutation.
- `serverError?: string` — populated when `mapError` returns a string/`{ formError }`, or by the default extractor when `mapError` is omitted.
- `lastResponse?: TResponse` — set after a successful trigger.

## `mapError` shapes

```ts
mapError: (err) => string; // → serverError
mapError: (err) => ({ formError: 'Server failure' }); // → serverError
mapError: (err) => ({ fieldErrors: { email: 'taken' } }); // → form.errors + touched flipped
mapError: (err) => undefined; // → default extractor runs
```

## Default error extractor

When `mapError` is omitted (or returns `undefined`), `useFormMutation` falls back to a structural extractor:

1. `err.data.message` (FetchBaseQueryError-style)
2. `err.message` (SerializedError-style or Error instance)
3. Otherwise `'Something went wrong. Please try again.'`

## Validation order

`useFormHandlers`'s validation runs before the mutation is triggered. When schema or `validate` produces errors, the mutation is **not** called and `handleSubmit` resolves to `false`.

See [Form](../components/form.md), [FormField](../components/form-field.md), [FormSubmit](../components/form-submit.md), and [useFormHandlers](./use-form-handlers.md).
