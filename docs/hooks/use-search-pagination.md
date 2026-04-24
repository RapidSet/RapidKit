# useSearchPagination

`useSearchPagination` manages list pagination parameters together with search query updates.

It supports:

- a single source of truth for `PaginationParams`
- query updates that reset the page to `1`
- normalizing empty queries to `undefined`
- full pagination replacement for table or paginator events

## Basic Example

```tsx
import { Button, Page, Text, useSearchPagination } from '@rapidset/rapidkit';

export function UsersPage() {
  const { paginationParams, handleSearch, handlePaginationChange } =
    useSearchPagination();

  async function fetchUsers(params) {
    // Call your data adapter with current params
    console.log(params);
  }

  return (
    <Page
      onSearch={handleSearch}
      searchPlaceholder="Search users"
      className="max-h-none"
    >
      <div className="space-y-4 rounded-xl border border-border bg-card p-4">
        <div className="flex items-center justify-between gap-3">
          <Text
            as="small"
            tone="muted"
            text={
              'Page ' +
              String(paginationParams.page ?? 1) +
              ' / Size ' +
              String(paginationParams.size ?? 20)
            }
          />

          <Button
            label="Next Page"
            onClick={() => {
              const next = {
                ...paginationParams,
                page: (paginationParams.page ?? 1) + 1,
              };

              handlePaginationChange(next);
              void fetchUsers(next);
            }}
          />
        </div>
      </div>
    </Page>
  );
}
```

## Behavior Notes

1. `handleSearch('value')` keeps other params and sets `query` to `'value'`.
2. `handleSearch('')` sets `query` to `undefined`.
3. Every `handleSearch` call forces `page` to `1`.
4. `handlePaginationChange` replaces the current params object.
