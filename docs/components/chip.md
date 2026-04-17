# Chip

## Purpose

Compact status/value chip with optional icon, variant and size controls, remove action, and access-aware interaction.

## Import

```tsx
import { Chip } from '@tarikukebede/mezmer';
```

## Common Props

- `label?: string`
- `icon?: LucideIcon`
- `variant?: 'primary' | 'secondary' | 'outline'`
- `size?: 'sm' | 'md' | 'lg'`
- `iconClassName?: string`
- `pulse?: boolean`
- `onRemove?: () => void`
- `disabled?: boolean`
- `accessRequirements?: string[]`
- `resolveAccess?: (requirement: string, mode: 'view' | 'edit') => boolean`

## Accessibility

- Remove action includes an `aria-label` (`Remove <label>` or `Remove chip`).

## Example

```tsx
import { Circle } from 'lucide-react';

<Chip
  label="Synced"
  icon={Circle}
  variant="secondary"
  size="md"
  onRemove={() => console.log('remove')}
/>;
```
