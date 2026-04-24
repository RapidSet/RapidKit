# Hooks

<p align="center">
  <img src="https://raw.githubusercontent.com/RapidSet/RapidKit/main/public/rapidkit.svg" alt="RapidKit" width="140" />
</p>

This section contains consumer-facing documentation for public hooks exported from `@rapidset/rapidkit`.

## Hooks

- [useDebounce](./use-debounce.md)
- [useFormHandlers](./use-form-handlers.md)
- [useSearchPagination](./use-search-pagination.md)

## Canonical Imports (AI-Friendly)

Use one import style everywhere to reduce AI-generated import errors:

1. Import hooks and components from `@rapidset/rapidkit` root.
2. Import base styles from `@rapidset/rapidkit/styles.css`.
3. Import exactly one theme from `@rapidset/rapidkit/themes/*`.

```tsx
import {
  useDebounce,
  useFormHandlers,
  useSearchPagination,
  Input,
  Checkbox,
  Button,
} from '@rapidset/rapidkit';
import '@rapidset/rapidkit/styles.css';
import '@rapidset/rapidkit/themes/default.css';
```
