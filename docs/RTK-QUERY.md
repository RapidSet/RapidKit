# RTK Query Integration

This guide shows how to use Redux Toolkit Query (RTK Query) as the data layer for Mezmer components.

The key idea is simple: Mezmer components remain presentational, and you inject async behavior through props like `searchOptions` and `getOptionById`.

## Install

```bash
pnpm add @reduxjs/toolkit react-redux
```

## 1. Create An API Slice

Define endpoints that match the component data contract.

```ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export type UserOption = {
  id: number;
  name: string;
  email: string;
};

type SearchUsersResponse = {
  items: UserOption[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
};

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    searchUsers: builder.query<
      SearchUsersResponse,
      { query: string; page: number; size: number }
    >({
      query: ({ query, page, size }) => ({
        url: 'users',
        params: { query, page, size },
      }),
      providesTags: ['User'],
    }),
    getUserById: builder.query<UserOption | null, number>({
      query: (id) => `users/${id}`,
      providesTags: ['User'],
    }),
  }),
});

export const { useLazySearchUsersQuery, useLazyGetUserByIdQuery } = usersApi;
```

## 2. Wire RTK Query Into Store

```ts
import { configureStore } from '@reduxjs/toolkit';
import { usersApi } from './usersApi';

export const store = configureStore({
  reducer: {
    [usersApi.reducerPath]: usersApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(usersApi.middleware),
});
```

## 3. Use `Autocomplete` With RTK Query

`Autocomplete` expects two async functions:

- `searchOptions(params) => Promise<{ items, currentPage, totalPages, totalItems }>`
- `getOptionById(id) => Promise<Option | null>` (optional)

RTK Query lazy hooks are a direct fit. In this version, query and pagination are tracked with stable, explicit defaults.

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
  const [paginationParams, setPaginationParams] = useState(
    DEFAULT_PAGINATION_PARAMS,
  );

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
      setPaginationParams({ page, size });

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
        renderOption={(item) => (
          <div>
            <div>{item.name}</div>
            <div className="text-xs text-muted-foreground">{item.email}</div>
          </div>
        )}
      />

      <p className="text-xs text-muted-foreground">
        Last request: query="{searchQuery}", page={paginationParams.page}, size=
        {paginationParams.size}
      </p>
    </div>
  );
}
```

## 4. Reuse The Same Pattern Across Components

The same RTK Query adapter idea works for other data-driven Mezmer components.

- `Search`: map query hook results into the shape expected by your search UI.
- `BaseTable`: feed paginated endpoint data into table rows and total count props.
- Form workflows: combine RTK Query mutations with `Input`, `DropDown`, and `DatePicker` in controlled forms.

## Notes

- Keep API-specific transformations in feature modules, not in core Mezmer components.
- Use `invalidatesTags` on mutations to refresh options after create/update operations.
- If you need deterministic caching behavior, tune endpoint args and `serializeQueryArgs` in your API slice.
