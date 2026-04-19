# Autocomplete

## Purpose

Reusable async autocomplete input with injectable search and optional pagination.

## Import

```tsx
import { Autocomplete } from '@tarikukebede/mezmer';
```

## Common Props

- `name: string`
- `value: T['id'] | null`
- `onSelectOption: (item: T | null) => void`
- `searchOptions: (params: { query: string; page: number; size: number }) => Promise<{ items: T[]; currentPage: number; totalPages: number; totalItems: number }>`
- `getOptionById?: (id: T['id']) => Promise<T | null>`
- `label?: string`
- `placeholder?: string`
- `size?: number`
- `renderOption?: (item: T) => ReactNode`
- `accessRequirements?: string[]`
- `resolveAccess?: (requirement: string, mode: 'view' | 'edit') => boolean`

## Accessibility

- Uses combobox semantics via `role="combobox"` on the input.
- Renders results as native list + button elements for keyboard and screen-reader compatibility.
- Label and required marker are rendered through the shared Input wrapper.

## Access Control Behavior

- No access config: visible and editable unless `disabled` is passed.
- View denied: component returns `null`.
- Edit denied: input renders disabled and dropdown toggle is blocked.

## Behavior

- Opens on focus or typing.
- Calls `searchOptions` with `{ query, page, size }`.
- Supports incremental pagination when scrolled near the bottom.
- Calls `onSelectOption(item)` when an option is selected.
- Calls `onSelectOption(null)` when the input is cleared.

## Example

```tsx
import { Autocomplete } from '@tarikukebede/mezmer';

type User = {
  id: number;
  name: string;
  email: string;
};

<Autocomplete<User>
  name="assignee"
  label="Assignee"
  value={null}
  searchOptions={async ({ query, page, size }) => {
    const response = await fetch(
      `/api/users?query=${encodeURIComponent(query)}&page=${page}&size=${size}`,
    );
    const data = await response.json();
    return {
      items: data.items,
      currentPage: data.currentPage,
      totalPages: data.totalPages,
      totalItems: data.totalItems,
    };
  }}
  onSelectOption={(item) => console.log(item)}
  renderOption={(item) => (
    <div>
      <div>{item.name}</div>
      <div className="text-xs text-muted-foreground">{item.email}</div>
    </div>
  )}
/>;
```

## RTK Query Integration

Use RTK Query lazy hooks to implement `searchOptions` and `getOptionById` without coupling `Autocomplete` to your API layer.

```tsx
import { useCallback, useState } from 'react';
import { Autocomplete } from '@tarikukebede/mezmer';
import {
  useLazyGetUserByIdQuery,
  useLazySearchUsersQuery,
  type UserOption,
} from './usersApi';

export function AssigneeField() {
  const DEFAULT_PAGINATION_PARAMS = { page: 1, size: 20 };

  const [selectedAssigneeId, setSelectedAssigneeId] = useState<number | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [queryParams, setQueryParams] = useState(DEFAULT_PAGINATION_PARAMS);

  const [triggerSearchUsers] = useLazySearchUsersQuery();
  const [triggerGetUserById] = useLazyGetUserByIdQuery();

  const searchOptions = useCallback(
    async ({
      query,
      page,
      size,
    }: {
      query: string;
      page: number;
      size: number;
    }) => {
      setSearchQuery(query);
      setQueryParams({ page, size });

      const result = await triggerSearchUsers(
        { query, page, size },
        true,
      ).unwrap();

      return {
        items: result.items,
        currentPage: result.currentPage,
        totalPages: result.totalPages,
        totalItems: result.totalItems,
      };
    },
    [triggerSearchUsers],
  );

  const getOptionById = useCallback(
    async (id: number) => {
      try {
        return await triggerGetUserById(id, true).unwrap();
      } catch {
        return null;
      }
    },
    [triggerGetUserById],
  );

  return (
    <div className="space-y-2">
      <Autocomplete<UserOption>
        name="assignee"
        label="Assignee"
        value={selectedAssigneeId}
        onSelectOption={(item) => setSelectedAssigneeId(item?.id ?? null)}
        searchOptions={searchOptions}
        getOptionById={getOptionById}
        placeholder="Search users"
      />

      <p className="text-xs text-muted-foreground">
        Last request: query="{searchQuery}", page={queryParams.page}, size=
        {queryParams.size}
      </p>
    </div>
  );
}
```
