# Form

## Purpose

Declarative form shell. Binds a `useFormHandlers` (or `useFormMutation`) result to a native `<form>`, provides field-binding context to descendant `<FormField>` components, and exposes submission/error/success slots.

## Import

```tsx
import {
  Form,
  FormField,
  FormSubmit,
  useFormMutation,
  Input,
  Checkbox,
} from '@rapidset/rapidkit';
```

## Basic Usage

```tsx
const form = useFormHandlers<LoginValues>({
  initialValues: { email: '', password: '', remember: false },
  schema: loginSchema,
  onSubmit: async (values) => {
    await api.login(values);
  },
});

<Form form={form}>
  <FormField name="email" label="Email" required>
    <Input type="email" placeholder="name@company.com" />
  </FormField>
  <FormField name="password" label="Password" required>
    <Input type="password" />
  </FormField>
  <FormField name="remember">
    <Checkbox title="Remember me" />
  </FormField>
  <FormSubmit label="Sign In" />
</Form>;
```

## With RTK Query (via `useFormMutation`)

```tsx
const form = useFormMutation<LoginValues, LoginValues, LoginResponse>({
  initialValues: { email: '', password: '', remember: false },
  schema: loginSchema,
  mutation: useLoginMutation,
  mapError: (err) => {
    const candidate = err as {
      data?: { fieldErrors?: Record<string, string> };
    };
    return { fieldErrors: candidate.data?.fieldErrors };
  },
  onSuccess: () => navigate('/'),
});

<Form
  form={form}
  isSubmitting={form.isSubmitting}
  serverError={form.serverError}
  successMessage={form.lastResponse ? 'Welcome back.' : undefined}
>
  {/* fields */}
  <FormSubmit label="Sign In" />
</Form>;
```

## Props

- `form: UseFormHandlersReturn<TValues>` — required form state.
- `children: ReactNode` — required.
- `onSubmit?` — override the default `form.handleSubmit` wiring.
- `id?`, `className?`, `noValidate?` (default `true`).
- `isSubmitting?: boolean` — drives the disabled fieldset and `<FormSubmit>` loading.
- `disableOnSubmit?: boolean` (default `true`) — wraps children in `<fieldset disabled>` while submitting.
- `resetOnSuccess?: boolean` (default `false`) — calls `form.resetForm()` after a successful submit.
- `serverError?: string`, `successMessage?: string` — surface form-level feedback.
- `errorBanner?`, `successBanner?` — `ReactNode | (text) => ReactNode` overrides for the default banners.

## Behavior

- Native `<form>` submission delegates to `form.handleSubmit(event)`, which runs schema/custom validation and only triggers `onSubmit` when valid.
- `isSubmitting && disableOnSubmit` wraps children in a `disabled` fieldset; all native form controls under it are disabled until submission settles.
- `resetOnSuccess` only resets when `handleSubmit` resolves to `true`.

## Composing with FormField

`<FormField>` reads the form state from context and injects `name`, `value`/`checked`, `onChange`/`onCheckChange`, `onBlur`, and `error` into a single React element child. Use the render-prop form when you need full control or a non-standard control:

```tsx
<FormField name="email">{(field) => <CustomInput {...field} />}</FormField>
```

See [FormField](./form-field.md) and [FormSubmit](./form-submit.md) for the companion components, and [useFormMutation](../hooks/use-form-mutation.md) for the RTK Query adapter.
