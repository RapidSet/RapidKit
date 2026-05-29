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

  describe('responsive sticky columns', () => {
    const multiColumns: Column<TestRow>[] = [
      {
        id: 'name',
        header: 'Name',
        accessorKey: 'name',
        type: CellType.TEXT,
      },
      {
        id: 'id',
        header: 'ID',
        accessorKey: 'id',
        type: CellType.TEXT,
      },
    ];

    const actionColumns: Column<TestRow>[] = [
      ...multiColumns,
      {
        id: 'actions',
        header: 'Actions',
        type: CellType.ACTIONS,
        actions: [{ label: 'Edit', onClick: vi.fn() }],
      },
    ];

    it('pins the first data column by default when selection is disabled', () => {
      render(
        <BaseTable<TestRow>
          data={rows}
          columns={multiColumns}
          queryParams={queryParams}
        />,
      );

      const nameHeader = screen.getByRole('columnheader', { name: 'Name' });
      const idHeader = screen.getByRole('columnheader', { name: 'ID' });
      expect(nameHeader.className.includes('sticky')).toBe(true);
      expect(nameHeader.className.includes('left-0')).toBe(true);
      expect(idHeader.className.includes('sticky')).toBe(false);
    });

    it('pins the selection column when selection is enabled', () => {
      render(
        <BaseTable<TestRow>
          data={rows}
          columns={multiColumns}
          enableSelection
          queryParams={queryParams}
        />,
      );

      const headers = screen.getAllByRole('columnheader');
      // First header is selection (no role name), second is Name, third ID.
      const selectionHeader = headers[0];
      expect(selectionHeader.className.includes('sticky')).toBe(true);
      expect(selectionHeader.className.includes('left-0')).toBe(true);

      const nameHeader = screen.getByRole('columnheader', { name: 'Name' });
      expect(nameHeader.className.includes('sticky')).toBe(false);
    });

    it('pins the last ACTIONS column to the right by inference', () => {
      render(
        <BaseTable<TestRow>
          data={rows}
          columns={actionColumns}
          queryParams={queryParams}
        />,
      );

      // ACTIONS column header has no accessible name (header is hidden), so
      // grab the last <th>.
      const headerCells = document.querySelectorAll('thead th');
      const lastHeader = headerCells[headerCells.length - 1] as HTMLElement;
      expect(lastHeader.className.includes('sticky')).toBe(true);
      expect(lastHeader.className.includes('right-0')).toBe(true);
    });

    it('does not apply sticky classes when responsive is false', () => {
      render(
        <BaseTable<TestRow>
          data={rows}
          columns={actionColumns}
          enableSelection
          responsive={false}
          queryParams={queryParams}
        />,
      );

      document.querySelectorAll('thead th, tbody td').forEach((cell) => {
        expect(cell.className.includes('sticky')).toBe(false);
      });
    });

    it('respects explicit column.sticky over selection inference', () => {
      const stickyOverrideColumns: Column<TestRow>[] = [
        { ...multiColumns[0], sticky: 'left' },
        multiColumns[1],
      ];

      render(
        <BaseTable<TestRow>
          data={rows}
          columns={stickyOverrideColumns}
          enableSelection
          queryParams={queryParams}
        />,
      );

      const headers = screen.getAllByRole('columnheader');
      const selectionHeader = headers[0];
      const nameHeader = screen.getByRole('columnheader', { name: 'Name' });

      expect(selectionHeader.className.includes('sticky')).toBe(false);
      expect(nameHeader.className.includes('sticky')).toBe(true);
      expect(nameHeader.className.includes('left-0')).toBe(true);
    });

    it('honors the first declared sticky column when two claim the same side', () => {
      const conflictingColumns: Column<TestRow>[] = [
        { ...multiColumns[0], sticky: 'left' },
        { ...multiColumns[1], sticky: 'left' },
      ];

      render(
        <BaseTable<TestRow>
          data={rows}
          columns={conflictingColumns}
          queryParams={queryParams}
        />,
      );

      const nameHeader = screen.getByRole('columnheader', { name: 'Name' });
      const idHeader = screen.getByRole('columnheader', { name: 'ID' });

      expect(nameHeader.className.includes('sticky')).toBe(true);
      expect(idHeader.className.includes('sticky')).toBe(false);
    });

    it('does not pin anything to the right when no ACTIONS column exists', () => {
      render(
        <BaseTable<TestRow>
          data={rows}
          columns={multiColumns}
          queryParams={queryParams}
        />,
      );

      document.querySelectorAll('thead th, tbody td').forEach((cell) => {
        expect(cell.className.includes('right-0')).toBe(false);
      });
    });

    it('mirrors the row state background on sticky body cells', () => {
      const inactiveColumns: Column<TestRow>[] = [
        {
          ...multiColumns[0],
          isInactive: (_value, item) => Boolean(item.inactive),
        },
        multiColumns[1],
      ];

      render(
        <BaseTable<TestRow>
          data={rows}
          columns={inactiveColumns}
          queryParams={queryParams}
        />,
      );

      const inactiveCell = screen
        .getByText('Alpha')
        .closest('td') as HTMLElement;
      expect(inactiveCell.className.includes('sticky')).toBe(true);
      expect(inactiveCell.className.includes('bg-muted/35')).toBe(true);
    });
  });

  describe('showFrom responsive columns', () => {
    const baseColumns: Column<TestRow>[] = [
      {
        id: 'name',
        header: 'Name',
        accessorKey: 'name',
        type: CellType.TEXT,
      },
      {
        id: 'id',
        header: 'ID',
        accessorKey: 'id',
        type: CellType.TEXT,
        showFrom: 'md',
      },
    ];

    it('applies hidden and md:table-cell classes to the header for a column with showFrom', () => {
      render(
        <BaseTable<TestRow>
          data={rows}
          columns={baseColumns}
          queryParams={queryParams}
        />,
      );

      const idHeader = screen.getByRole('columnheader', { name: 'ID' });
      expect(idHeader.className.includes('hidden')).toBe(true);
      expect(idHeader.className.includes('md:table-cell')).toBe(true);
    });

    it('applies hidden and md:table-cell classes to the matching body cell', () => {
      render(
        <BaseTable<TestRow>
          data={rows}
          columns={baseColumns}
          queryParams={queryParams}
        />,
      );

      const alphaRow = screen.getByText('Alpha').closest('tr') as HTMLElement;
      const idCell = alphaRow.querySelectorAll('td')[1] as HTMLElement;
      expect(idCell.className.includes('hidden')).toBe(true);
      expect(idCell.className.includes('md:table-cell')).toBe(true);
    });

    it('does not add hidden class when showFrom is undefined', () => {
      render(
        <BaseTable<TestRow>
          data={rows}
          columns={baseColumns}
          queryParams={queryParams}
        />,
      );

      const nameHeader = screen.getByRole('columnheader', { name: 'Name' });
      expect(nameHeader.className.includes('hidden')).toBe(false);
      expect(nameHeader.className.includes('md:table-cell')).toBe(false);
    });

    it('skips showFrom columns when inferring the default sticky-left anchor', () => {
      const hiddenFirstColumns: Column<TestRow>[] = [
        {
          id: 'id',
          header: 'ID',
          accessorKey: 'id',
          type: CellType.TEXT,
          showFrom: 'md',
        },
        {
          id: 'name',
          header: 'Name',
          accessorKey: 'name',
          type: CellType.TEXT,
        },
      ];

      render(
        <BaseTable<TestRow>
          data={rows}
          columns={hiddenFirstColumns}
          queryParams={queryParams}
        />,
      );

      const idHeader = screen.getByRole('columnheader', { name: 'ID' });
      const nameHeader = screen.getByRole('columnheader', { name: 'Name' });
      expect(idHeader.className.includes('sticky')).toBe(false);
      expect(nameHeader.className.includes('sticky')).toBe(true);
      expect(nameHeader.className.includes('left-0')).toBe(true);
    });

    it('still applies sticky classes when a column has both sticky and showFrom', () => {
      const dualColumns: Column<TestRow>[] = [
        {
          id: 'name',
          header: 'Name',
          accessorKey: 'name',
          type: CellType.TEXT,
        },
        {
          id: 'id',
          header: 'ID',
          accessorKey: 'id',
          type: CellType.TEXT,
          sticky: 'left',
          showFrom: 'md',
        },
      ];

      render(
        <BaseTable<TestRow>
          data={rows}
          columns={dualColumns}
          queryParams={queryParams}
        />,
      );

      const idHeader = screen.getByRole('columnheader', { name: 'ID' });
      expect(idHeader.className.includes('sticky')).toBe(true);
      expect(idHeader.className.includes('hidden')).toBe(true);
    });

    it('skips an ACTIONS column with showFrom when inferring the right anchor', () => {
      const hiddenActionsColumns: Column<TestRow>[] = [
        {
          id: 'name',
          header: 'Name',
          accessorKey: 'name',
          type: CellType.TEXT,
        },
        {
          id: 'actions',
          header: 'Actions',
          type: CellType.ACTIONS,
          actions: [{ label: 'Edit', onClick: vi.fn() }],
          showFrom: 'lg',
        },
      ];

      render(
        <BaseTable<TestRow>
          data={rows}
          columns={hiddenActionsColumns}
          queryParams={queryParams}
        />,
      );

      document.querySelectorAll('thead th, tbody td').forEach((cell) => {
        expect(cell.className.includes('right-0')).toBe(false);
      });
    });

    it('renders the empty-state row without crashing when columns declare showFrom', () => {
      render(
        <BaseTable<TestRow>
          data={[]}
          columns={baseColumns}
          queryParams={queryParams}
          placeholder="None"
        />,
      );

      expect(screen.getByText('None')).toBeTruthy();
    });

    it('applies showFrom classes when columns are passed via customRow', () => {
      const customColumns: Column<TestRow>[] = [
        {
          id: 'name',
          header: 'Name',
          accessorKey: 'name',
          type: CellType.TEXT,
        },
        {
          id: 'id',
          header: 'ID',
          accessorKey: 'id',
          type: CellType.TEXT,
          showFrom: 'lg',
        },
      ];

      render(
        <BaseTable<TestRow>
          data={rows}
          columns={[]}
          customRow={customColumns}
          queryParams={queryParams}
        />,
      );

      const idHeader = screen.getByRole('columnheader', { name: 'ID' });
      expect(idHeader.className.includes('hidden')).toBe(true);
      expect(idHeader.className.includes('lg:table-cell')).toBe(true);
    });
  });
});
