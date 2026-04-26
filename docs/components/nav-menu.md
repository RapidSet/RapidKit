# NavMenu

## Purpose

Composable wrapper around shadcn `Navigation Menu` that ships with a ready-to-use default layout for both descriptive dashboard menus and compact dropdown submenus.

## Import

```tsx
import { NavMenu } from '@rapidset/rapidkit';
```

<ComponentExampleTabs component="nav-menu" />

## Required Props

- `sections: NavMenuSection[]`

## NavMenuItem Shape

- `label: string`
- `href: string`
- `icon?: LucideIcon`
- `description?: string`
- `disabled?: boolean`
- `external?: boolean`
- `target?: string`
- `rel?: string`

## Common Optional Props

- `renderItem?: (item: NavMenuItem) => ReactNode`
- `className?: string`
- `listClassName?: string`
- `triggerClassName?: string`
- `contentClassName?: string`
- `linkClassName?: string`
- `descriptionClassName?: string`
- `viewportClassName?: string`
- `ariaLabel?: string`
- `access?: NavMenuAccessConfig`
- `canAccess?: NavMenuAccessResolver`
- `value?: string`
- `onValueChange?: (value: string) => void`

## Accessibility

- Uses Radix Navigation Menu semantics from the shadcn primitive.
- Allows a custom root `aria-label` through `ariaLabel`.
- Disabled items render with `aria-disabled="true"` and no interactive anchor.

## Interaction

- External items (`external: true`) default to `target="_blank"` and `rel="noopener noreferrer"`.
- Items with descriptions render as richer dashboard-style menu panels by default.
- Items without descriptions automatically collapse into compact dropdown submenu rows.
- Submenu items optionally render leading Lucide icons when `item.icon` is provided.
- Disabled and external items get built-in status badges out of the box.
- `renderItem` lets consumers replace default item content while preserving menu structure.

## Access Control

- Uses the shared RapidKit access pattern via `access` and `canAccess` props.
- When view access is denied, the component returns `null`.
- When edit access is denied, sections remain visible but all submenu items become non-interactive (`aria-disabled="true"`).
- If `canAccess` is omitted, NavMenu inherits resolver context from `RapidKitAccessProvider`.
