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
- accessRequirements?: string[]
- resolveAccess?: (requirement: string, mode: 'view' | 'edit') => boolean
- Any supported shadcn Sidebar props such as side, variant, collapsible, and className

## Access Control

- No resolver or no requirements: SideBar stays visible and interactive.
- If read requirements fail: SideBar returns null.
- If write requirements fail: SideBar remains visible but child interactions are disabled.

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
      accessRequirements={['sidebar.read', 'sidebar.write']}
      resolveAccess={(requirement, mode) =>
        mode === 'view'
          ? requirement.endsWith('.read')
          : requirement.endsWith('.write')
      }
    />
  );
}
```
