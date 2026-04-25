# DatePicker

## Purpose

Access-aware date picker composed from package shadcn primitives (`Popover` + `Calendar`) with controlled value updates.

## Import

```tsx
import { DatePicker } from '@rapidset/rapidkit';
```

<ComponentExampleTabs component="date-picker" />

## Required Props

- `name: string`
- `onChange: (change: { target: { name: string; value: string | undefined } }) => void`

## Common Optional Props

- `value?: string` (recommended `YYYY-MM-DD`)
- `label?: string`
- `required?: boolean`
- `helperText?: string`
- `error?: string`
- `placeholder?: string`
- `disabled?: boolean`
- `startMonth?: Date`
- `endMonth?: Date`
- `open?: boolean`
- `onOpenChange?: (open: boolean) => void`
- `access?: DatePickerAccessConfig`
- `canAccess?: (rule: DatePickerAccessRule, mode: 'view' | 'edit') => boolean`

## Accessibility

- Associates label and trigger button via `htmlFor` and `id`.
- Sets `aria-invalid="true"` when `error` is present.
- Uses keyboard-accessible popover and calendar primitives.

## Access Behavior

- No `canAccess` or no `access`: visible and interactive unless `disabled` is set.
- View denied: renders `null`.
- Edit denied: remains visible but becomes disabled.
- For provider inheritance and CASL adapter examples, see [Access Control](../ACCESS_CONTROL.md).
