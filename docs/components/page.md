# Page

## Purpose

Composable page-level layout wrapper with an optional header area for search, filter slot content, and action buttons.

## Import

```tsx
import { Page } from '@rapidset/rapidkit';
```

<ComponentExampleTabs component="page" />

## Common Props

- `children: ReactNode`
- `actions?: PageAction[]`
- `className?: string`
- `onSearch?: (value: string) => void`
- `enableSearch?: boolean`
- `filterSlot?: ReactNode`
- `searchPlaceholder?: string`

## PageAction Shape

- `name: string`
- `onClick: () => void`
- `icon?: LucideIcon`
- `variant?: ButtonVariant`
- `disabled?: boolean`
- `access?: ButtonAccessConfig`
- `canAccess?: ButtonAccessResolver`
- `accessDeniedBehavior?: 'hide' | 'disable'`

## Accessibility

- Uses the package Search and Button components for keyboard and semantic behavior.

## Behavior

- Header is shown by default.
- Set `enableSearch={false}` to render only the page body.
- `onSearch` receives the current input value whenever search text changes.
