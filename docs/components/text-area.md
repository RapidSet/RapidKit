# TextArea

## Purpose

Controlled multi-line text input wrapper with optional label, helper/error text, and access-aware visibility/editability.

## Import

```tsx
import { TextArea } from '@rapidset/rapidkit';
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
- `access?: TextAreaAccessConfig`
- `canAccess?: (rule: TextAreaAccessRule, mode: 'view' | 'edit') => boolean`

## Accessibility

- Associates label and textarea via `htmlFor`/`id`.
- Sets `aria-invalid="true"` when error is present.

## Access Control

- No resolver or no rules: textarea stays visible and editable.
- Read or view rules gate visibility.
- Write or edit rules gate editability.
- `RapidKitAccessProvider` can supply a default `canAccess` resolver when the prop is omitted.
