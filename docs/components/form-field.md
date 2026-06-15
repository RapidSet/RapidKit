# FormField

## Purpose

A context-aware field wrapper. Reads the form state from the enclosing `<Form>`, resolves a field by name, auto-detects text vs checkbox binding from the value's type, and either clones a single React element child with the right bindings + chrome props or invokes a render-prop with a full `FormFieldRenderArgs`.

## Import

```tsx
import { FormField } from '@rapidset/rapidkit';
```

## Basic Usage

```tsx
<FormField name="email" label="Email" required>
  <Input type="email" placeholder="name@company.com" />
</FormField>

<FormField name="remember">
  <Checkbox title="Remember me" />
</FormField>
```

## Render-Prop Form

For custom inputs or full control:

```tsx
<FormField name="bio" label="Bio" helperText="Markdown supported">
  {(field) => (
    <CustomMarkdownEditor
      value={String(field.value ?? '')}
      onChange={(text) =>
        field.onChange({ target: { name: field.name, value: text } } as never)
      }
      onBlur={field.onBlur}
      invalid={Boolean(field.error)}
    />
  )}
</FormField>
```

## Props

- `name: string` — required field name; must exist on the form's value shape.
- `label?`, `helperText?`, `infoText?`, `required?` — chrome props forwarded to the cloned input.
- `description?: string` — long-form descriptive text rendered above the input.
- `error?: string` — explicit override; otherwise the field error is read from the form (honoring `touched` unless `showUntouchedError` is set).
- `className?: string` — applied to the wrapper.
- `as?: 'text' | 'checkbox' | 'auto'` (default `'auto'`) — explicit binding-shape override. Auto-detects by value type (boolean → checkbox).
- `showUntouchedError?: boolean` — surface field errors even before the field has been touched.
- `children: ReactNode | (field: FormFieldRenderArgs) => ReactNode`.

## Behavior

- Bindings are injected last in prop-merge order: user-provided `placeholder`, `type`, `className`, etc. survive, but `value`/`onChange` (or `checked`/`onCheckChange`) are always sourced from the form so the form remains the source of truth.
- Label, required asterisk, helper text, error text are owned by the wrapped input primitive (Input, Checkbox, etc.). `<FormField>` only renders the optional `description` itself, plus the wrapper div.
- `description` renders above the cloned input.
- The field id is composed as `${formId ?? 'rk-form'}-${name}`; the wrapped input uses this id and the matching `htmlFor`.
- Using `<FormField>` outside a `<Form>` throws.

## `FormFieldRenderArgs`

```ts
{
  name: string;
  value: unknown;
  checked: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onCheckChange: (checked: boolean) => void;
  onBlur: () => void;
  error?: string;
  required?: boolean;
  disabled: boolean;
  id: string;
}
```

See [Form](./form.md) and [FormSubmit](./form-submit.md).
