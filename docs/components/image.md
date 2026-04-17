# Image

## Purpose

Image component with size variants and fallback icon rendering when source is missing or fails.

## Import

```tsx
import { Image } from '@tarikukebede/mezmer';
```

## Common Props

- `src?: string`
- `alt?: string`
- `size?: 'sm' | 'md' | 'lg'`
- `className?: string`
- `loading?: 'lazy' | 'eager'`
- `srcSet?: string`
- `accessRequirements?: string[]`
- `resolveAccess?: (requirement: string, mode: 'view' | 'edit') => boolean`

## Accessibility

- Forwards `alt` to the native `<img>` element.

## Example

```tsx
<Image src="/avatar.png" alt="User avatar" size="md" loading="lazy" />
```
