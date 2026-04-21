# Text

## Purpose

Presentational text primitive for consistent typography tokens, semantic element selection, and optional access-aware visibility.

## Import

```tsx
import { Text } from '@tarikukebede/mezmer';
```

<ComponentExampleTabs component="text" />

## Required Props

- `children: ReactNode`

## Common Optional Props

- `as?: 'span' | 'p' | 'small' | 'strong' | 'div'`
- `tone?: 'default' | 'muted' | 'destructive' | 'success'`
- `weight?: 'regular' | 'medium' | 'semibold' | 'bold'`
- `truncate?: boolean`
- `className?: string`
- `accessRequirements?: string[]`
- `resolveAccess?: (requirement: string, mode: 'view') => boolean`

## Accessibility

- Uses the semantic HTML element selected with `as`.
- Keeps copy in normal document flow with no implicit interactive behavior.
