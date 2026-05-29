# BaseTable

## Purpose

Generic table built on TanStack Table with sorting, selection, pagination callbacks, and access-aware behavior.

## Import

```tsx
import { BaseTable } from '@rapidset/rapidkit';
```

<ComponentExampleTabs component="base-table" />

## Required Props

- `data: T[]`
- `columns: Column<T>[]`

## Common Optional Props

- `customRow?: Column<T>[]`
- `placeholder?: string`
- `queryParams?: { query: string; page: number; size: number }`
- `onQueryParamsChange?: (params) => void`
- `sortBy?: string`
- `sortOrder?: 'asc' | 'desc'`
- `onSortChange?: (sortBy: string, sortOrder: 'asc' | 'desc') => void`
- `enableSelection?: boolean`
- `onSelectionChange?: (selectedItems: T[]) => void`
- `access?: BaseTableAccessConfig`
- `canAccess?: BaseTableAccessResolver`

## Access Behavior

- No resolver or no rules: the table remains visible and interactive.
- View denied: component returns `null`.
- Edit denied: selection controls are disabled while rows remain visible.
- For provider inheritance and CASL adapter examples, see [Access Control](../ACCESS_CONTROL.md).

## Responsive Behavior

`BaseTable` is responsive by default. When the table is wider than its container, it scrolls horizontally inside the shadcn `<Table>` wrapper, while one anchor column stays pinned on the left and the last `CellType.ACTIONS` column stays pinned on the right. On wide viewports the behavior is invisible — nothing scrolls, nothing visibly pins.

### Default inference

- **Sticky left:** the selection checkbox column when `enableSelection`, otherwise the first declared column.
- **Sticky right:** the last column whose `type === CellType.ACTIONS`. If no `ACTIONS` column exists, nothing pins right.

### Opt out

Pass `responsive={false}` to disable all sticky behavior. The table still scrolls horizontally on overflow (provided by the underlying primitive); no columns pin.

```tsx
<BaseTable data={rows} columns={columns} responsive={false} />
```

### Override per column

Set `column.sticky: 'left' | 'right'` to pin a specific column. Explicit overrides beat inference, including the selection-column anchor. If two columns claim the same side, the first declared wins and subsequent same-side claims are ignored.

```tsx
const columns = [
  { id: 'name', header: 'Service', type: CellType.TEXT, sticky: 'left' },
  { id: 'status', header: 'Status', type: CellType.STATUS },
  {
    id: 'actions',
    header: 'Actions',
    type: CellType.ACTIONS,
    actions: [
      /* ... */
    ],
  },
];
```

### Hide columns at narrow widths

Set `column.showFrom` to deprioritize a column on small screens. The column only renders at viewports at or above the named Tailwind breakpoint. Implementation is CSS-only — no JavaScript resize listeners, SSR-safe, and composes with the sticky behavior above.

| Breakpoint | Min width |
| ---------- | --------- |
| `sm`       | 640px     |
| `md`       | 768px     |
| `lg`       | 1024px    |
| `xl`       | 1280px    |
| `2xl`      | 1536px    |

```tsx
const columns = [
  { id: 'name', header: 'Service', type: CellType.TEXT },
  { id: 'owner', header: 'Owner', type: CellType.AVATAR, showFrom: 'md' },
  { id: 'region', header: 'Region', type: CellType.CHIP, showFrom: 'lg' },
];
```

Interaction with sticky inference:

- Columns declaring `showFrom` are skipped when BaseTable infers the default sticky-left anchor or the sticky-right action column, so the pinned column never disappears at narrow widths.
- Explicit `column.sticky` still wins. If a column sets both `sticky: 'left'` and `showFrom: 'md'`, CSS hides it below `md` — and no column pins on that side there.
- The selection checkbox column never accepts `showFrom` (selection stays visible at every viewport).

### Known constraint

Sticky positioning resolves against the nearest scrolling ancestor — the shadcn `<Table>` primitive's `overflow-auto` wrapper. If any ancestor in the consuming app sets `overflow: hidden`, sticky cells silently revert to normal scrolling. Keep the wrapper chain free of `overflow-hidden`.

### Action Menu Highlighting

For `CellType.ACTIONS`, each action can include a `variant` to highlight the icon and label in the expanded menu.

- `variant?: 'primary' | 'success' | 'warning' | 'danger'`

```tsx
{
  id: 'actions',
  header: 'Actions',
  type: CellType.ACTIONS,
  actions: [
    { label: 'Inspect', iconName: 'Search', variant: 'primary', onClick: () => {} },
    { label: 'Delete', iconName: 'Trash2', variant: 'danger', onClick: () => {} },
  ],
}
```

## Accessibility

- Selection checkboxes expose accessible labels for header and rows.

## RTK Query Integration

For server-side pagination and sorting, keep `queryParams` for `{ query, page, size }` and track sort state separately.

```tsx
import { useMemo, useState } from 'react';
import { BaseTable } from '@rapidset/rapidkit';
import { CellType } from '@rapidset/rapidkit/base-table';
import { useListServicesQuery } from './servicesApi';

type Row = {
  id: number;
  name: string;
  owner: string;
  status: 'active' | 'inactive' | 'degraded';
  tags: string[];
  region: string;
  createdAt: string;
  alertsCount: number;
  hasDrift: boolean;
  logoUrl: string;
};

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
      {
        id: 'logo',
        header: 'Logo',
        accessorKey: 'logoUrl',
        type: CellType.IMAGE,
      },
      {
        id: 'name',
        header: 'Service',
        accessorKey: 'name',
        type: CellType.TEXT,
        sortable: true,
      },
      {
        id: 'owner',
        header: 'Owner',
        accessorKey: 'owner',
        type: CellType.AVATAR,
      },
      {
        id: 'status',
        header: 'Status',
        accessorKey: 'status',
        type: CellType.STATUS,
        sortable: true,
      },
      {
        id: 'tags',
        header: 'Tags',
        accessorKey: 'tags',
        type: CellType.MULTI_STATUS,
      },
      {
        id: 'region',
        header: 'Region',
        accessorKey: 'region',
        type: CellType.CHIP,
      },
      {
        id: 'createdAt',
        header: 'Created',
        accessorKey: 'createdAt',
        type: CellType.DATE,
        sortable: true,
      },
      {
        id: 'alertsIcon',
        header: 'Alerts',
        accessorKey: 'alertsCount',
        type: CellType.ICON,
        iconNameMapper: (value) =>
          typeof value === 'number' && value > 5
            ? 'AlertTriangle'
            : value
              ? 'TriangleAlert'
              : 'ShieldCheck',
      },
      {
        id: 'drift',
        header: 'Drift',
        accessorKey: 'hasDrift',
        type: CellType.BOOLEAN,
      },
      {
        id: 'actions',
        header: 'Actions',
        type: CellType.ACTIONS,
        actions: [
          { label: 'Inspect', iconName: 'Search', onClick: () => {} },
          { label: 'Restart', iconName: 'RotateCcw', onClick: () => {} },
        ],
      },
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
      enableSelection
      onSortChange={(nextSortBy, nextSortOrder) => {
        setSortBy(nextSortBy);
        setSortOrder(nextSortOrder);
        setQueryParams((previous) => ({ ...previous, page: 1 }));
      }}
    />
  );
}
```
