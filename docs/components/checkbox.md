# Checkbox

## Purpose

Theme-aware checkbox with optional label/title, helper text, and error state.

## Import

```tsx
import { Checkbox } from '@tarikukebede/mezmer';
```

## Required Props

- `name: string`

## Common Optional Props

- `checked?: boolean`
- `onCheckChange?: (checked: boolean, name: string) => void`
- `onChange?: (event: ChangeEvent<HTMLInputElement>) => void`
- `label?: string`
- `title?: string`
- `helperText?: string`
- `error?: string`
- `required?: boolean`
- `accessRequirements?: string[]`
- `resolveAccess?: (requirement: string, mode: 'view' | 'edit') => boolean`

## Accessibility

- Uses native checkbox input semantics.
- Associates label with input using `htmlFor`.

## Example

```tsx
<Checkbox
  name="acceptTerms"
  label="Terms"
  title="I agree to the terms"
  onCheckChange={(checked) => console.log(checked)}
/>
```
