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
- `access?: CheckboxAccessConfig`
- `canAccess?: CheckboxAccessResolver`

## Accessibility

- Uses native checkbox input semantics.
- Associates label with input using `htmlFor`.

## Access Control

- No resolver or no rules: checkbox stays visible and interactive.
- Read or view rules gate visibility.
- Write or edit rules gate interactivity.
- For provider inheritance and CASL adapter examples, see [Access Control](../ACCESS_CONTROL.md).
