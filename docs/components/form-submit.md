# FormSubmit

## Purpose

`<Button>` wrapper bound to `<Form>` context. Defaults to `type="submit"`, reads `isSubmitting` from context, and applies `loading` + `disabled` automatically. Every other Button prop passes through.

## Import

```tsx
import { FormSubmit } from '@rapidset/rapidkit';
```

## Basic Usage

```tsx
<Form form={form} isSubmitting={form.isSubmitting}>
  {/* fields */}
  <FormSubmit label="Sign In" />
</Form>
```

## Props

- `type?: 'submit' | 'button'` (default `'submit'`).
- `disabled?: boolean` — additive: OR'd with the context-driven submitting state.
- `loadingWhenSubmitting?: boolean` (default `true`).
- `disableWhenSubmitting?: boolean` (default `true`).
- All other [`<Button>`](./button.md) props (`label`, `leftIcon`, `rightIcon`, `variant`, `className`, `access`, `canAccess`, etc.).

## Behavior

- When the enclosing `<Form>` has `isSubmitting={true}`, the button is automatically loading and disabled.
- Set `loadingWhenSubmitting={false}` to suppress the spinner while submitting (e.g., when you render your own progress indicator).
- Set `disableWhenSubmitting={false}` for a "save & continue typing" pattern where the button stays clickable.
- Throws when used outside a `<Form>`.

See [Form](./form.md) and [Button](./button.md).
