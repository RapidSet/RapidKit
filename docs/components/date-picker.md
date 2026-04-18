# DatePicker

## Purpose

Access-aware date picker composed from package shadcn primitives (`Popover` + `Calendar`) with controlled value updates.

## Import

```tsx
import { DatePicker } from '@tarikukebede/mezmer';
```

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
- `accessRequirements?: string[]`
- `resolveAccess?: (requirement: string, mode: 'view' | 'edit') => boolean`

## Accessibility

- Associates label and trigger button via `htmlFor` and `id`.
- Sets `aria-invalid="true"` when `error` is present.
- Uses keyboard-accessible popover and calendar primitives.

## Access Behavior

- No `resolveAccess` or no `accessRequirements`: visible and interactive unless `disabled` is set.
- View denied: renders `null`.
- Edit denied: remains visible but becomes disabled.

## Example

```tsx
<DatePicker
  name="startDate"
  label="Start Date"
  value="2026-04-18"
  helperText="Choose a start date"
  accessRequirements={['project.startDate.write']}
  resolveAccess={(requirement, mode) => {
    if (mode === 'view')
      return requirement.endsWith('.read') || requirement.endsWith('.write');
    return requirement.endsWith('.write');
  }}
  onChange={(change) => {
    console.log(change.target.name, change.target.value);
  }}
/>
```
