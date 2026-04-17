# Page

## Purpose

Composable page-level layout wrapper with an optional header area for search, filter slot content, and action buttons.

## Import

```tsx
import { Page } from '@tarikukebede/mezmer';
```

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
- `accessRequirements?: string[]`
- `resolveAccess?: (requirement: string, mode: 'action') => boolean`
- `accessDeniedBehavior?: 'hide' | 'disable'`

## Accessibility

- Uses the package Search and Button components for keyboard and semantic behavior.

## Behavior

- Header is shown by default.
- Set `enableSearch={false}` to render only the page body.
- `onSearch` receives the current input value whenever search text changes.

## Example

```tsx
import { Plus } from 'lucide-react';
import { ButtonVariant, Page, Search } from '@tarikukebede/mezmer';

<Page
  searchPlaceholder="Search users"
  onSearch={(value) => console.log(value)}
  actions={[
    {
      name: 'Create User',
      onClick: () => console.log('create'),
      icon: Plus,
      variant: ButtonVariant.Default,
      accessRequirements: ['users.create'],
    },
  ]}
  filterSlot={<div className="text-xs text-muted-foreground">Active only</div>}
>
  <div className="rounded-md border p-4">Page content</div>
</Page>;

<Search
  placeholder="Global search"
  onChange={(value) => console.log('search term', value)}
/>;
```
