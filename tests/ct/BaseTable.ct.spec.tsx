import { expect, test } from '@playwright/experimental-ct-react';
import { BaseTable } from '../../src/components/BaseTable';
import { CellType } from '../../src/components/BaseTable/components/BaseTableRow/components/BaseTableCell';
import type { Column } from '../../src/components/BaseTable/components/BaseTableRow';
import type { BaseTablePaginationParams } from '../../src/components/BaseTable/types';

type TableRowModel = {
  id: number;
  name: string;
  createdAt: string;
};

const columns: Column<TableRowModel>[] = [
  {
    id: 'name',
    header: 'Name',
    accessorKey: 'name',
    type: CellType.TEXT,
    sortable: true,
  },
  {
    id: 'createdAt',
    header: 'Created At',
    accessorKey: 'createdAt',
    type: CellType.DATE,
  },
];

const rows: TableRowModel[] = [
  { id: 1, name: 'Alpha', createdAt: '2026-01-01' },
  { id: 2, name: 'Beta', createdAt: '2026-01-02' },
];

const paginationParams: BaseTablePaginationParams = {
  page: 1,
  size: 10,
};

test.describe('BaseTable (Component Test)', () => {
  test('calls onSortChange when sortable header is clicked', async ({
    mount,
  }) => {
    let latestSort: { sortBy: string; sortOrder: 'asc' | 'desc' } | null = null;

    const component = await mount(
      <BaseTable<TableRowModel>
        data={rows}
        columns={columns}
        totalItems={2}
        totalPages={1}
        paginationParams={paginationParams}
        onSortChange={(sortBy, sortOrder) => {
          latestSort = { sortBy, sortOrder };
        }}
      />,
    );

    await component.getByText('Name').click();

    await expect.poll(() => latestSort?.sortBy ?? null).toBe('name');
    await expect.poll(() => latestSort?.sortOrder ?? null).toBe('asc');
  });

  test('handles row selection callback', async ({ mount }) => {
    let selectedItems: TableRowModel[] = [];

    const component = await mount(
      <BaseTable<TableRowModel>
        data={rows}
        columns={columns}
        totalItems={2}
        totalPages={1}
        paginationParams={paginationParams}
        enableSelection
        onSelectionChange={(items) => {
          selectedItems = items;
        }}
      />,
    );

    await component.getByLabel('Select row').first().check();

    await expect.poll(() => selectedItems.length).toBe(1);
    await expect.poll(() => selectedItems[0]?.id ?? null).toBe(1);
  });
});
