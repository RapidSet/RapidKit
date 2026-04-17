import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { BaseTable } from './BaseTable';
import { CellType } from './components/BaseTableRow/components/BaseTableCell';
import type { Column } from './components/BaseTableRow';
import type { BaseTablePaginationParams } from './types';

interface TestRow {
  id: number;
  name: string;
  inactive?: boolean;
}

const columns: Column<TestRow>[] = [
  {
    id: 'name',
    header: 'Name',
    accessorKey: 'name',
    type: CellType.TEXT,
    sortable: true,
  },
];

const rows: TestRow[] = [
  { id: 1, name: 'Alpha', inactive: true },
  { id: 2, name: 'Beta' },
];

const paginationParams: BaseTablePaginationParams = {
  page: 1,
  size: 10,
};

describe('BaseTable', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders table data and pagination controls', () => {
    render(
      <BaseTable<TestRow>
        data={rows}
        columns={columns}
        totalItems={2}
        totalPages={1}
        paginationParams={paginationParams}
      />,
    );

    expect(Boolean(screen.getByText('Name'))).toBe(true);
    expect(Boolean(screen.getByText('Alpha'))).toBe(true);
    expect(Boolean(screen.getByText('Beta'))).toBe(true);
    expect(
      Boolean(screen.getByRole('button', { name: 'Go to next page' })),
    ).toBe(true);
  });

  it('calls onRowClicked when a row is clicked', () => {
    const onRowClicked = vi.fn();
    const clickableRows: TestRow[] = [
      { id: 1, name: 'Alpha', inactive: false },
      { id: 2, name: 'Beta', inactive: false },
    ];

    render(
      <BaseTable<TestRow>
        data={clickableRows}
        columns={columns}
        paginationParams={paginationParams}
        onRowClicked={onRowClicked}
      />,
    );

    fireEvent.click(screen.getByText('Alpha'));

    expect(onRowClicked).toHaveBeenCalledTimes(1);
    expect(onRowClicked).toHaveBeenCalledWith(clickableRows[0]);
  });

  it('does not trigger row click when row is inactive', () => {
    const onRowClicked = vi.fn();
    const columnsWithInactive: Column<TestRow>[] = [
      {
        id: 'name',
        header: 'Name',
        accessorKey: 'name',
        type: CellType.TEXT,
        isInactive: (_value, item) => Boolean(item.inactive),
      },
    ];

    render(
      <BaseTable<TestRow>
        data={rows}
        columns={columnsWithInactive}
        paginationParams={paginationParams}
        onRowClicked={onRowClicked}
      />,
    );

    fireEvent.click(screen.getByText('Alpha'));
    fireEvent.click(screen.getByText('Beta'));

    expect(onRowClicked).toHaveBeenCalledTimes(1);
    expect(onRowClicked).toHaveBeenCalledWith(rows[1]);
  });

  it('calls onSortChange with asc and desc directions', () => {
    const onSortChange = vi.fn();

    const { rerender } = render(
      <BaseTable<TestRow>
        data={rows}
        columns={columns}
        paginationParams={{ ...paginationParams }}
        onSortChange={onSortChange}
      />,
    );

    fireEvent.click(screen.getByText('Name'));
    expect(onSortChange).toHaveBeenCalledWith('name', 'asc');

    rerender(
      <BaseTable<TestRow>
        data={rows}
        columns={columns}
        paginationParams={{
          ...paginationParams,
          sortBy: 'name',
          sortOrder: 'asc',
        }}
        onSortChange={onSortChange}
      />,
    );

    fireEvent.click(screen.getByText('Name'));
    expect(onSortChange).toHaveBeenCalledWith('name', 'desc');
  });

  it('handles row selection and emits selected rows', async () => {
    const onSelectionChange = vi.fn();
    const columnsWithInactive: Column<TestRow>[] = [
      {
        id: 'name',
        header: 'Name',
        accessorKey: 'name',
        type: CellType.TEXT,
        isInactive: (_value, item) => Boolean(item.inactive),
      },
    ];

    render(
      <BaseTable<TestRow>
        data={rows}
        columns={columnsWithInactive}
        enableSelection
        onSelectionChange={onSelectionChange}
        paginationParams={paginationParams}
      />,
    );

    const checkboxes = screen.getAllByRole('checkbox');
    expect((checkboxes[1] as HTMLInputElement).disabled).toBe(true);

    fireEvent.click(checkboxes[2]);

    await waitFor(() => {
      expect(onSelectionChange).toHaveBeenCalled();
    });

    const latestCall =
      onSelectionChange.mock.calls[onSelectionChange.mock.calls.length - 1][0];
    expect(latestCall).toHaveLength(1);
    expect(latestCall[0]).toEqual(rows[1]);
  });

  it('shows placeholder when there is no data', () => {
    render(
      <BaseTable<TestRow>
        data={[]}
        columns={columns}
        placeholder="Nothing to show"
        paginationParams={paginationParams}
      />,
    );

    expect(Boolean(screen.getByText('Nothing to show'))).toBe(true);
  });

  it('returns null when view access is denied', () => {
    const { container } = render(
      <BaseTable<TestRow>
        data={rows}
        columns={columns}
        paginationParams={paginationParams}
        accessRequirements={['table.read']}
        resolveAccess={() => false}
      />,
    );

    expect(container.firstChild).toBeNull();
  });
});
