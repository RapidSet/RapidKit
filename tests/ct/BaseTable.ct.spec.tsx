import { expect, test } from '@playwright/experimental-ct-react';
import { BaseTable } from '../../src/components/BaseTable';
import { CellType } from '../../src/components/BaseTable/components/BaseTableRow/components/BaseTableCell';
import type { Column } from '../../src/components/BaseTable/components/BaseTableRow';
import type { BaseTableQueryParams } from '../../src/components/BaseTable/types';

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

const queryParams: BaseTableQueryParams = {
  query: '',
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
        queryParams={queryParams}
        onSortChange={(sortBy, sortOrder) => {
          latestSort = { sortBy, sortOrder };
        }}
      />,
    );

    await component.getByText('Name').click();

    await expect.poll(() => latestSort?.sortBy ?? null).toBe('name');
    await expect.poll(() => latestSort?.sortOrder ?? null).toBe('asc');
  });

  test('scrolls table body in place and keeps header and footer pinned when parent bounds height', async ({
    mount,
  }) => {
    const manyRows: TableRowModel[] = Array.from(
      { length: 60 },
      (_, index) => ({
        id: index + 1,
        name: `Row ${index + 1}`,
        createdAt: `2026-01-${String((index % 28) + 1).padStart(2, '0')}`,
      }),
    );

    const component = await mount(
      <div
        style={{
          height: 280,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
        }}
      >
        <BaseTable<TableRowModel>
          data={manyRows}
          columns={columns}
          totalItems={manyRows.length}
          totalPages={Math.ceil(manyRows.length / 10)}
          queryParams={{ query: '', page: 1, size: 10 }}
        />
      </div>,
    );

    const footer = component.getByRole('button', { name: 'Go to next page' });
    const head = component.locator('thead').first();
    const scrollArea = component
      .locator('thead')
      .locator('xpath=ancestor::div[1]');

    await expect(footer).toBeInViewport();

    const wrapperBoxBefore = await component.boundingBox();
    const footerBoxBefore = await footer.boundingBox();
    const headBoxBefore = await head.boundingBox();
    expect(wrapperBoxBefore).not.toBeNull();
    expect(footerBoxBefore).not.toBeNull();
    expect(headBoxBefore).not.toBeNull();

    await scrollArea.evaluate((el) => {
      (el as HTMLElement).scrollTop = 200;
    });

    await expect(footer).toBeInViewport();
    const footerBoxAfter = await footer.boundingBox();
    const headBoxAfter = await head.boundingBox();
    expect(footerBoxAfter).not.toBeNull();
    expect(headBoxAfter).not.toBeNull();

    expect(Math.abs(footerBoxAfter!.y - footerBoxBefore!.y)).toBeLessThan(2);
    expect(Math.abs(headBoxAfter!.y - headBoxBefore!.y)).toBeLessThan(2);
    expect(headBoxAfter!.y).toBeLessThan(footerBoxAfter!.y);
  });

  test('handles row selection callback', async ({ mount }) => {
    let selectedItems: TableRowModel[] = [];

    const component = await mount(
      <BaseTable<TableRowModel>
        data={rows}
        columns={columns}
        totalItems={2}
        totalPages={1}
        queryParams={queryParams}
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
