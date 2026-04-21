# Search

## Purpose

Reusable search input wrapper with a leading icon and string-based change callback.

## Import

```tsx
import { Search } from '@rapidset/rapidkit';
```

<ComponentExampleTabs component="search" />

## Common Props

- `placeholder?: string`
- `value?: string`
- `onChange?: (value: string) => void`
- `disabled?: boolean`
- `className?: string`
- `inputClassName?: string`
- `onKeyDown?: KeyboardEventHandler<HTMLInputElement>`
- `ariaLabel?: string`

## Accessibility

- Uses a native search input.
- Supports custom `aria-label` via `ariaLabel`.
- Search icon is decorative (`aria-hidden`).

## Behavior

- Uses `Search...` as default placeholder.
- Stops keydown propagation to avoid parent keyboard handler conflicts.
- Still calls consumer `onKeyDown` after stopping propagation.
- Calls `onChange` with the plain string value.
