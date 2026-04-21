# TextArea

## Purpose

Controlled multi-line text input wrapper with optional label, helper/error text, and access-aware visibility/editability.

## Import

```tsx
import { TextArea } from '@tarikukebede/mezmer';
```

<ComponentExampleTabs component="text-area" />

## Required Props

- `name: string`
- `onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void`

## Common Optional Props

- `value?: string`
- `label?: string`
- `required?: boolean`
- `error?: string`
- `helperText?: string`
- `infoText?: string`
- `rows?: number`
- `placeholder?: string`
- `disabled?: boolean`
- `accessRequirements?: string[]`
- `resolveAccess?: (requirement: string, mode: 'view' | 'edit') => boolean`

## Accessibility

- Associates label and textarea via `htmlFor`/`id`.
- Sets `aria-invalid="true"` when error is present.
