# DropDown

## Purpose

Theme-aware select wrapper with optional label, helper/error text, custom option rendering, and access-aware visibility/editability.

## Import

```tsx
import { DropDown } from '@rapidset/rapidkit';
```

<ComponentExampleTabs component="drop-down" />

## Required Props

- `onChange: (value: string) => void`
- `options: { label: string; value: string }[]`

## Common Optional Props

- `value?: string`
- `label?: string`
- `placeholder?: string`
- `renderOption?: (option: DropDownOption) => ReactNode`
- `required?: boolean`
- `disabled?: boolean`
- `helperText?: string`
- `error?: string`
- `onOpenChange?: (open: boolean) => void`
- `access?: DropDownAccessConfig`
- `canAccess?: (rule: DropDownAccessRule, mode: 'view' | 'edit') => boolean`

## Accessibility

- Renders a required marker (`*`) when `required` is true.
- Sets `aria-invalid="true"` on the trigger when `error` is present.

## Access Behavior

- No resolver or no rules: component is visible and editable (unless `disabled` is true).
- View denied: component returns `null`.
- View allowed but edit denied: component stays visible and is disabled.
- For provider inheritance and CASL adapter examples, see [Access Control](../ACCESS_CONTROL.md).
