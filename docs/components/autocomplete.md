# Autocomplete

## Purpose

Reusable async autocomplete input with injectable search and optional pagination.

## Import

```tsx
import { Autocomplete } from '@rapidset/rapidkit';
```

<ComponentExampleTabs component="autocomplete" />

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
- `access?: AutocompleteAccessConfig`
- `canAccess?: (rule: AutocompleteAccessRule, mode: 'view' | 'edit') => boolean`

## Accessibility

- Uses combobox semantics via `role="combobox"` on the input.
- Renders results as native list + button elements for keyboard and screen-reader compatibility.
- Label and required marker are rendered through the shared Input wrapper.

## Access Control Behavior

- No resolver or no rules: visible and editable unless `disabled` is passed.
- View denied: component returns `null`.
- Edit denied: input renders disabled and dropdown toggle is blocked.
- For provider inheritance and CASL adapter examples, see [Access Control](../ACCESS_CONTROL.md).

## Behavior

- Opens on focus or typing.
- Calls `searchOptions` with `{ query, page, size }`.
- Supports incremental pagination when scrolled near the bottom.
- Calls `onSelectOption(item)` when an option is selected.
- Calls `onSelectOption(null)` when the input is cleared.

## Rich Option Layout

Use `renderOption` to render a custom option row with icon, metadata, and compact typography.

```tsx
import { Receipt } from 'lucide-react';
import { Autocomplete } from '@rapidset/rapidkit';

type PricePlan = {
  id: string;
  name: string;
  amount: number;
  currency: string;
  billingInterval: 'day' | 'week' | 'month' | 'year';
};

const RenderOption = (item: PricePlan) => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center">
        <Receipt className="h-4 w-4 text-muted-foreground/50" />
      </div>
      <div className="flex-grow">
        <div className="text-xs font-normal text-muted-foreground/70">
          {item.name} - {item.amount} {item.currency.toUpperCase()} /
          {item.billingInterval}
        </div>
      </div>
    </div>
  );
};

function PricePlanAutocomplete() {
  return (
    <Autocomplete<PricePlan>
      name="pricePlan"
      value={null}
      onSelectOption={() => undefined}
      searchOptions={async () => ({
        items: [],
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
      })}
      renderOption={RenderOption}
      placeholder="Select a price plan"
    />
  );
}
```

## RTK Query Integration

Use RTK Query lazy hooks to implement `searchOptions` and `getOptionById` without coupling `Autocomplete` to your API layer.

```tsx
import { useCallback, useState } from 'react';
import { Autocomplete } from '@rapidset/rapidkit';
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
