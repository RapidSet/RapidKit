# BaseTable

## Purpose

Generic table built on TanStack Table with sorting, selection, pagination callbacks, and access-aware behavior.

## Import

```tsx
import { BaseTable } from '@tarikukebede/mezmer';
```

## Required Props

- `data: T[]`

## Common Optional Props

- `columns?: Column<T>[]`
- `customRow?: Column<T>[]`
- `placeholder?: string`
- `queryParams?: { query: string; page: number; size: number }`
- `onQueryParamsChange?: (params) => void`
- `sortBy?: string`
- `sortOrder?: 'asc' | 'desc'`
- `onSortChange?: (sortBy: string, sortOrder: 'asc' | 'desc') => void`
- `enableSelection?: boolean`
- `onSelectionChange?: (selectedItems: T[]) => void`
- `accessRequirements?: string[]`
- `resolveAccess?: (requirement: string, mode: 'view' | 'edit') => boolean`

## Accessibility

- Selection checkboxes expose accessible labels for header and rows.

## Example

```tsx
type Row = { id: number; name: string; status: string };

const rows: Row[] = [
  { id: 1, name: 'Payment Service', status: 'active' },
  { id: 2, name: 'Audit Service', status: 'inactive' },
];

<BaseTable<Row>
  data={rows}
  columns={[
    { key: 'name', label: 'Name' },
    { key: 'status', label: 'Status', sortable: true },
  ]}
  onSortChange={(sortBy, sortOrder) => console.log(sortBy, sortOrder)}
/>;
```

## RTK Query Integration

For server-side pagination and sorting, keep `queryParams` for `{ query, page, size }` and track sort state separately.

```tsx
import { useMemo, useState } from 'react';
import { BaseTable } from '@tarikukebede/mezmer';
import { useListServicesQuery } from './servicesApi';

type Row = { id: number; name: string; status: string };

type QueryParams = {
  query: string;
  page: number;
  size: number;
};

const DEFAULT_QUERY_PARAMS: QueryParams = {
  query: '',
  page: 1,
  size: 10,
};

export function ServicesTable() {
  const [queryParams, setQueryParams] = useState(DEFAULT_QUERY_PARAMS);
  const [sortBy, setSortBy] = useState<string | undefined>();
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | undefined>();

  const { data, isFetching } = useListServicesQuery({
    ...queryParams,
    sortBy,
    sortOrder,
  });

  const rows = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;
  const totalItems = data?.totalItems ?? 0;

  const columns = useMemo(
    () => [
      { key: 'name' as const, label: 'Name', sortable: true },
      { key: 'status' as const, label: 'Status', sortable: true },
    ],
    [],
  );

  return (
    <BaseTable<Row>
      data={rows}
      columns={columns}
      isLoading={isFetching}
      totalPages={totalPages}
      totalItems={totalItems}
      queryParams={queryParams}
      onQueryParamsChange={setQueryParams}
      sortBy={sortBy}
      sortOrder={sortOrder}
      onSortChange={(nextSortBy, nextSortOrder) => {
        setSortBy(nextSortBy);
        setSortOrder(nextSortOrder);
        setQueryParams((previous) => ({ ...previous, page: 1 }));
      }}
    />
  );
}
```
