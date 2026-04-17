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
- `paginationParams?: { page: number; size: number; sortBy?: string; sortOrder?: 'asc' | 'desc' }`
- `onPaginationChange?: (params) => void`
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
