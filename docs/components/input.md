# Input

## Purpose

Controlled text input wrapper with optional label, helper/error text, and access-aware visibility/editability.

## Import

```tsx
import { Input } from '@tarikukebede/mezmer';
```

## Required Props

- `name: string`
- `onChange: (e: ChangeEvent<HTMLInputElement>) => void`

## Common Optional Props

- `value?: string | number`
- `type?: React.HTMLInputTypeAttribute`
- `label?: string`
- `required?: boolean`
- `error?: string`
- `helperText?: string`
- `disabled?: boolean`
- `accessRequirements?: string[]`
- `resolveAccess?: (requirement: string, mode: 'view' | 'edit') => boolean`

## Accessibility

- Associates label and input via `htmlFor`/`id`.
- Sets `aria-invalid="true"` when error is present.

## Example

```tsx
<Input
  name="email"
  label="Email"
  value=""
  onChange={() => {}}
  placeholder="name@company.com"
/>
```
