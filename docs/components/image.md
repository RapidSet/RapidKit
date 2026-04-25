# Image

## Purpose

Image component with size variants and fallback icon rendering when source is missing or fails.

## Import

```tsx
import { Image } from '@rapidset/rapidkit';
```

<ComponentExampleTabs component="image" />

## Common Props

- `src?: string`
- `alt?: string`
- `size?: 'sm' | 'md' | 'lg'`
- `className?: string`
- `loading?: 'lazy' | 'eager'`
- `srcSet?: string`
- `access?: ImageAccessConfig`
- `canAccess?: (rule: ImageAccessRule, mode: 'view') => boolean`

## Accessibility

- Forwards `alt` to the native `<img>` element.

## Access Control

- No resolver or no rules: image remains visible.
- View denied: component returns `null`.
- Non-view rules do not hide the image.
- For provider inheritance and CASL adapter examples, see [Access Control](../ACCESS_CONTROL.md).
