# Chip

## Purpose

Compact status/value chip with optional icon, variant and size controls, remove action, and access-aware interaction.

## Import

```tsx
import { Chip } from '@rapidset/rapidkit';
```

<ComponentExampleTabs component="chip" />

## Common Props

- `label?: string`
- `icon?: LucideIcon`
- `variant?: 'primary' | 'secondary' | 'outline'`
- `size?: 'sm' | 'md' | 'lg'`
- `iconClassName?: string`
- `pulse?: boolean`
- `onRemove?: () => void`
- `disabled?: boolean`
- `access?: ChipAccessConfig`
- `canAccess?: ChipAccessResolver`

## Accessibility

- Remove action includes an `aria-label` (`Remove <label>` or `Remove chip`).

## Access Control

- No resolver or no rules: chip remains visible and interactive.
- Read or view rules gate visibility.
- Write or edit rules gate remove interaction.
- For provider inheritance and CASL adapter examples, see [Access Control](../ACCESS_CONTROL.md).
