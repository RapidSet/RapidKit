# Toggle

## Purpose

Theme-aware switch toggle for boolean settings with optional label/title, helper text, and error state.

## Import

```tsx
import { Toggle } from '@rapidset/rapidkit';
```

<ComponentExampleTabs component="toggle" />

## Required Props

- `name: string`

## Common Optional Props

- `checked?: boolean`
- `defaultChecked?: boolean`
- `onCheckedChange?: (checked: boolean) => void`
- `onToggleChange?: (checked: boolean, name: string) => void`
- `label?: string`
- `title?: string`
- `helperText?: string`
- `error?: string`
- `required?: boolean`
- `access?: ToggleAccessConfig`
- `canAccess?: (rule: ToggleAccessRule, mode: 'view' | 'edit') => boolean`

## Accessibility

- Uses accessible switch semantics from Radix Switch primitives.
- Associates label text with the toggle using `htmlFor` and `id`.

## Access Control

- No resolver or no rules: toggle stays visible and interactive.
- Read or view rules gate visibility.
- Write or edit rules gate interactivity.
- For provider inheritance and CASL adapter examples, see [Access Control](../ACCESS_CONTROL.md).
