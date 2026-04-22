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
- `accessRequirements?: string[]`
- `resolveAccess?: (requirement: string, mode: 'view') => boolean`

## Accessibility

- Forwards `alt` to the underlying avatar image element.
- Uses fallback text when image content is unavailable.

## Access Control

- No resolver or no requirements: avatar remains visible.
- View denied: component returns `null`.
- `.write` requirements without `.read` keep the component visible by convention.
