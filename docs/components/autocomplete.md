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
- `searchOptions: (params: { query: string; page: number; size: number; pageSize?: number }) => Promise<{ items: T[]; currentPage: number; totalPages: number; totalItems: number }>`
- `getOptionById?: (id: T['id']) => Promise<T | null>`
- `label?: string`
- `placeholder?: string`
- `pageSize?: number`
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
- Calls `searchOptions` with `{ query, page, size }` and includes `pageSize` for backward compatibility.
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

For a full Redux Toolkit Query setup and adapter pattern using `searchOptions` and `getOptionById`, see [RTK Query Integration](../RTK-QUERY.md).
