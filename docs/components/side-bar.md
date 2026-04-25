# SideBar

## Purpose

Domain-neutral sidebar shell built on shadcn Sidebar primitives with composable brand, navigation, and user menu sections.

## Import

```tsx
import { SideBar } from '@rapidset/rapidkit';
```

<ComponentExampleTabs component="side-bar" />

## Common Props

- children?: ReactNode
- brand?: ReactNode
- navigation?: ReactNode
- footer?: ReactNode
- menuItems?: SideBarMenuItem[]
- user?: SideBarUserInfo
- userActions?: SideBarUserAction[]
- showHeaderSeparator?: boolean
- showRail?: boolean
- providerProps?: Omit<React.ComponentProps<typeof SidebarProvider>, 'children'>
- access?: SideBarAccessConfig
- canAccess?: (rule: SideBarAccessRule, mode: 'view' | 'edit') => boolean
- Any supported shadcn Sidebar props such as side, variant, collapsible, and className

## Access Control

- No resolver or no rules: SideBar stays visible and interactive.
- Read or view rules gate visibility.
- Write or edit rules gate interactivity (disabled behavior).
- Rules support `match: 'any' | 'all'` through `access.match`.
- For provider inheritance, explicit override behavior, and CASL adapter examples, see [Access Control](../ACCESS_CONTROL.md).

## Accessibility

- Uses shadcn Sidebar primitives and preserves their keyboard and focus behavior.
- Keeps semantic regions through SidebarHeader, SidebarContent, and SidebarFooter.

## Usage

```tsx
import { SideBar } from '@rapidset/rapidkit';
import { LogOut, Settings } from 'lucide-react';
import '@rapidset/rapidkit/styles.css';
import '@rapidset/rapidkit/themes/default.css';

export function ExampleSideBar() {
  return (
    <SideBar
      menuItems={[
        {
          key: 'settings',
          label: 'Settings',
          icon: Settings,
          onSelect: () => {},
        },
      ]}
      user={{ name: 'Alex Doe', email: 'alex@example.com' }}
      userActions={[
        { key: 'logout', label: 'Log out', icon: LogOut, onSelect: () => {} },
      ]}
      access={{
        match: 'all',
        rules: [
          { action: 'read', subject: 'sidebar' },
          { action: 'write', subject: 'sidebar' },
        ],
      }}
      canAccess={(rule) =>
        rule.subject === 'sidebar' &&
        (rule.action === 'read' || rule.action === 'write')
      }
    />
  );
}
```
