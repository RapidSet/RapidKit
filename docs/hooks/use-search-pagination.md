# useSearchPagination

`useSearchPagination` manages list pagination parameters together with search query updates.

It supports:

- a single source of truth for `PaginationParams`
- query updates that reset the page to `1`
- normalizing empty queries to `undefined`
- full pagination replacement for table or paginator events

## Basic Example

```tsx
import { Search, useSearchPagination } from '@rapidset/rapidkit';

export function UsersPage() {
  const { paginationParams, handleSearch, handlePaginationChange } =
    useSearchPagination({
      page: 1,
      size: 20,
    });

  async function fetchUsers(params) {
    // Call your data adapter with current params
    console.log(params);
  }

  return (
    <div className="space-y-4">
      <Search
        value={paginationParams.query ?? ''}
        onChange={(event) => {
          handleSearch(event.target.value);
        }}
      />

      <button
        type="button"
        onClick={() => {
          const next = {
            ...paginationParams,
            page: (paginationParams.page ?? 1) + 1,
          };

          handlePaginationChange(next);
          void fetchUsers(next);
        }}
      >
        Next Page
      </button>
    </div>
  );
}
```

## Behavior Notes

1. `handleSearch('value')` keeps other params and sets `query` to `'value'`.
2. `handleSearch('')` sets `query` to `undefined`.
3. Every `handleSearch` call forces `page` to `1`.
4. `handlePaginationChange` replaces the current params object.
