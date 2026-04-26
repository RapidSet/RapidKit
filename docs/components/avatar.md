# Avatar

## Purpose

Avatar wrapper with size variants, image/fallback rendering, and injectable visibility access control.

## Import

```tsx
import { Avatar } from '@rapidset/rapidkit';
```

<ComponentExampleTabs component="avatar" />

## Common Props

- `src?: string`
- `alt?: string`
- `fallback?: ReactNode`
- `size?: 'sm' | 'md' | 'lg'`
- `className?: string`
- `imageClassName?: string`
- `fallbackClassName?: string`
- `access?: AvatarAccessConfig`
- `canAccess?: AvatarAccessResolver`

## Accessibility

- Forwards `alt` to the underlying avatar image element.
- Uses fallback text when image content is unavailable.

## Access Control

- No resolver or no rules: avatar remains visible.
- View denied: component returns `null`.
- Non-view rules do not hide the avatar.
- For provider inheritance and CASL adapter examples, see [Access Control](../ACCESS_CONTROL.md).
