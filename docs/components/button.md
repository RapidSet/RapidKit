# Button

## Purpose

Theme-aware action button with optional leading icon, loading state, and injectable action access control.

## Import

```tsx
import { Button, ButtonVariant } from '@rapidset/rapidkit';
```

<ComponentExampleTabs component="button" />

## Common Props

- `label?: string`
- `children?: ReactNode`
- `leftIcon?: LucideIcon`
- `rightIcon?: LucideIcon`
- `loading?: boolean`
- `variant?: ButtonVariant`
- `disabled?: boolean`
- `access?: ButtonAccessConfig`
- `canAccess?: ButtonAccessResolver`
- `accessDeniedBehavior?: 'hide' | 'disable'`

## Accessibility

- Renders a native `button` element.
- Sets `aria-busy="true"` while loading.
- Supports standard button attributes like `aria-label`, `type`, and `disabled`.

## Access Control

- No resolver or no rules: button remains visible and enabled.
- All listed action rules must pass by default (`access.match` defaults to `'all'`).
- Action denied with `accessDeniedBehavior="hide"`: component returns `null`.
- Action denied with `accessDeniedBehavior="disable"`: button remains visible but becomes disabled.
- For provider inheritance and CASL adapter examples, see [Access Control](../ACCESS_CONTROL.md).
