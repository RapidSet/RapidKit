# Checkbox

## Purpose

Theme-aware checkbox with optional label/title, helper text, and error state.

## Import

```tsx
import { Checkbox } from '@rapidset/rapidkit';
```

<ComponentExampleTabs component="checkbox" />

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
