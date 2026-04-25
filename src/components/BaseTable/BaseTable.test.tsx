import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { RapidKitAccessProvider } from '@lib/access-provider';
import { BaseTable } from './BaseTable';
import { CellType } from './components/BaseTableRow/components/BaseTableCell';
import type { Column } from './components/BaseTableRow';
import type { BaseTableQueryParams } from './types';

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

const queryParams: BaseTableQueryParams = {
  query: '',
  page: 1,
  size: 10,
};

let canView = true;
let canEdit = true;

const canAccess = vi.fn(
  (
    _: { action: string; subject: string; mode?: 'view' | 'edit' },
    mode: 'view' | 'edit',
  ) => (mode === 'view' ? canView : canEdit),
);

describe('BaseTable', () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    canView = true;
    canEdit = true;
    canAccess.mockClear();
  });

  it('renders table data and pagination controls', () => {
    render(
      <BaseTable<TestRow>
        data={rows}
        columns={columns}
        totalItems={2}
        totalPages={1}
        queryParams={queryParams}
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
        queryParams={queryParams}
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
        queryParams={queryParams}
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
        queryParams={{ ...queryParams }}
        onSortChange={onSortChange}
      />,
    );

    fireEvent.click(screen.getByText('Name'));
    expect(onSortChange).toHaveBeenCalledWith('name', 'asc');

    rerender(
      <BaseTable<TestRow>
        data={rows}
        columns={columns}
        queryParams={{ ...queryParams }}
        sortBy="name"
        sortOrder="asc"
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
        queryParams={queryParams}
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
        queryParams={queryParams}
      />,
    );

    expect(Boolean(screen.getByText('Nothing to show'))).toBe(true);
  });

  it('applies theme background class to data rows', () => {
    render(
      <BaseTable<TestRow>
        data={rows}
        columns={columns}
        queryParams={queryParams}
      />,
    );

    const betaCell = screen.getByText('Beta');
    const betaRow = betaCell.closest('tr');

    expect(betaRow).not.toBeNull();
    expect(betaRow?.className.includes('bg-background')).toBe(true);
  });

  it('renders the action column as a menu without a visible header', () => {
    const onEdit = vi.fn();
    const actionColumns: Column<TestRow>[] = [
      ...columns,
      {
        id: 'actions',
        header: 'Actions',
        type: CellType.ACTIONS,
        actions: [{ label: 'Edit', onClick: onEdit }],
      },
    ];

    render(
      <BaseTable<TestRow>
        data={rows}
        columns={actionColumns}
        queryParams={queryParams}
      />,
    );

    expect(screen.queryByRole('columnheader', { name: 'Actions' })).toBeNull();

    fireEvent.pointerDown(
      screen.getAllByRole('button', { name: 'Open row actions' })[0],
    );
    fireEvent.click(screen.getByRole('menuitem', { name: 'Edit' }));

    expect(onEdit).toHaveBeenCalledWith(rows[0]);
  });

  it('returns null when view access is denied', () => {
    canView = false;

    const { container } = render(
      <BaseTable<TestRow>
        data={rows}
        columns={columns}
        queryParams={queryParams}
        access={{ rules: [{ action: 'read', subject: 'table' }] }}
        canAccess={canAccess}
      />,
    );

    expect(container.firstChild).toBeNull();
    expect(canAccess).toHaveBeenCalledWith(
      { action: 'read', subject: 'table' },
      'view',
    );
  });

  it('disables selection when edit access is denied', () => {
    canEdit = false;

    render(
      <BaseTable<TestRow>
        data={rows}
        columns={columns}
        enableSelection
        queryParams={queryParams}
        access={{ rules: [{ action: 'write', subject: 'table' }] }}
        canAccess={canAccess}
      />,
    );

    const checkboxes = screen.getAllByRole('checkbox');
    expect((checkboxes[0] as HTMLInputElement).disabled).toBe(true);
    expect((checkboxes[1] as HTMLInputElement).disabled).toBe(true);
    expect((checkboxes[2] as HTMLInputElement).disabled).toBe(true);
    expect(canAccess).toHaveBeenCalledWith(
      { action: 'write', subject: 'table' },
      'edit',
    );
  });

  it('inherits canAccess from RapidKitAccessProvider when prop is omitted', () => {
    const { container } = render(
      <RapidKitAccessProvider canAccess={() => false}>
        <BaseTable<TestRow>
          data={rows}
          columns={columns}
          queryParams={queryParams}
          access={{ rules: [{ action: 'read', subject: 'table' }] }}
        />
      </RapidKitAccessProvider>,
    );

    expect(container.firstChild).toBeNull();
  });

  it('prefers explicit canAccess over RapidKitAccessProvider value', () => {
    render(
      <RapidKitAccessProvider canAccess={() => false}>
        <BaseTable<TestRow>
          data={rows}
          columns={columns}
          queryParams={queryParams}
          access={{ rules: [{ action: 'read', subject: 'table' }] }}
          canAccess={() => true}
        />
      </RapidKitAccessProvider>,
    );

    expect(screen.getByText('Alpha')).toBeTruthy();
  });
});
