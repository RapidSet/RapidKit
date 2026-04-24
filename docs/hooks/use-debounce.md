# useDebounce

`useDebounce` returns a delayed copy of a value, which is useful for throttling expensive effects like search requests.

## Signature

```tsx
function useDebounce<T>(
  value: T,
  delay: number,
  options?: {
    enabled?: boolean;
    isEqual?: (previous: T, next: T) => boolean;
  },
): T;
```

## Basic Example

```tsx
import { useEffect, useState } from 'react';
import { useDebounce } from '@rapidset/rapidkit';

export function SearchState() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    // Trigger API only after the user pauses typing
    console.log('Search with', debouncedQuery);
  }, [debouncedQuery]);

  return (
    <input
      value={query}
      onChange={(event) => {
        setQuery(event.target.value);
      }}
    />
  );
}
```

## Options

1. `enabled`: When `false`, the hook returns updates immediately without waiting.
2. `isEqual`: Custom comparator to avoid state updates when values are semantically the same.

## Integration Tip

Compose `useDebounce` with `useSearchPagination` by debouncing the input query and calling `handleSearch` when the debounced query changes.
