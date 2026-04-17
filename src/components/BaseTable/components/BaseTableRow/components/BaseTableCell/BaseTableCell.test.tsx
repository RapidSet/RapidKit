import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { ReactNode } from 'react';
import {
  ActionCell,
  BooleanCell,
  DateCell,
  IconCell,
  MultiStatusCell,
  StatusCell,
  TextCell,
} from './BaseTableCell';
import { CellType } from './types';
import type { Column } from '@components/BaseTable/components/BaseTableRow/types';
import type { CellContext } from '@tanstack/react-table';

interface TestModel {
  id: number;
  name: string;
  active: boolean;
  statuses: string[];
  createdAt: string;
}

const renderCell = (
  columnDef: ReturnType<
    | typeof TextCell<TestModel>
    | typeof DateCell<TestModel>
    | typeof BooleanCell<TestModel>
    | typeof StatusCell<TestModel>
    | typeof IconCell<TestModel>
    | typeof MultiStatusCell<TestModel>
    | typeof ActionCell<TestModel>
  >,
  row: { original: TestModel; getValue: (key: string) => unknown },
) => {
  if (typeof columnDef.cell !== 'function') {
    throw new TypeError('Cell renderer is missing');
  }

  const node = columnDef.cell({
    row,
  } as unknown as CellContext<TestModel, unknown>);

  return render(
    <table>
      <thead>
        <tr>
          <th>value</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{node as ReactNode}</td>
        </tr>
      </tbody>
    </table>,
  );
};

describe('BaseTableCell', () => {
  afterEach(() => {
    cleanup();
  });

  it('TextCell renders accessor value', () => {
    const column: Column<TestModel> = {
      id: 'name',
      header: 'Name',
      accessorKey: 'name',
      type: CellType.TEXT,
    };

    renderCell(TextCell(column), {
      original: {
        id: 1,
        name: 'Alpha',
        active: true,
        statuses: [],
        createdAt: '2024-01-01',
      },
      getValue: () => undefined,
    });

    expect(Boolean(screen.getByText('Alpha'))).toBe(true);
  });

  it('DateCell formats date values', () => {
    const column: Column<TestModel> = {
      id: 'createdAt',
      header: 'Created',
      accessorKey: 'createdAt',
      type: CellType.DATE,
    };

    renderCell(DateCell(column), {
      original: {
        id: 1,
        name: 'Alpha',
        active: true,
        statuses: [],
        createdAt: '2024-01-02',
      },
      getValue: () => '2024-01-02',
    });

    expect(Boolean(screen.getByText('Jan 02, 2024'))).toBe(true);
  });

  it('BooleanCell maps boolean state to yes/no', () => {
    const column: Column<TestModel> = {
      id: 'active',
      header: 'Active',
      accessorKey: 'active',
      type: CellType.BOOLEAN,
    };

    const activeView = renderCell(BooleanCell(column), {
      original: {
        id: 1,
        name: 'Alpha',
        active: true,
        statuses: [],
        createdAt: '2024-01-01',
      },
      getValue: () => true,
    });

    expect(Boolean(screen.getByText('Yes'))).toBe(true);

    activeView.unmount();

    renderCell(BooleanCell(column), {
      original: {
        id: 1,
        name: 'Alpha',
        active: false,
        statuses: [],
        createdAt: '2024-01-01',
      },
      getValue: () => false,
    });

    expect(Boolean(screen.getByText('No'))).toBe(true);
  });

  it('ActionCell triggers action handler', () => {
    const onAction = vi.fn();
    const rowData: TestModel = {
      id: 3,
      name: 'Gamma',
      active: true,
      statuses: [],
      createdAt: '2024-01-01',
    };

    const column: Column<TestModel> = {
      id: 'actions',
      header: 'Actions',
      type: CellType.ACTIONS,
      actions: [
        {
          label: 'Edit',
          onClick: onAction,
        },
      ],
    };

    renderCell(ActionCell(column), {
      original: rowData,
      getValue: () => undefined,
    });

    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));
    expect(onAction).toHaveBeenCalledWith(rowData);
  });

  it('StatusCell renders status value', () => {
    const column: Column<TestModel> = {
      id: 'status',
      header: 'Status',
      accessorKey: 'name',
      type: CellType.STATUS,
    };

    renderCell(StatusCell(column), {
      original: {
        id: 7,
        name: 'active',
        active: true,
        statuses: [],
        createdAt: '2024-01-01',
      },
      getValue: () => undefined,
    });

    expect(Boolean(screen.getByText('active'))).toBe(true);
  });

  it('IconCell renders resolved icon from mapper', () => {
    const column: Column<TestModel> = {
      id: 'icon',
      header: 'Icon',
      accessorKey: 'active',
      type: CellType.ICON,
      iconNameMapper: (value) => (value ? 'Circle' : undefined),
    };

    renderCell(IconCell(column), {
      original: {
        id: 9,
        name: 'Alpha',
        active: true,
        statuses: [],
        createdAt: '2024-01-01',
      },
      getValue: () => undefined,
    });

    expect(document.querySelectorAll('svg').length > 0).toBe(true);
  });

  it('MultiStatusCell renders primary status and count badge', () => {
    const column: Column<TestModel> = {
      id: 'statuses',
      header: 'Statuses',
      accessorKey: 'statuses',
      type: CellType.MULTI_STATUS,
    };

    renderCell(MultiStatusCell(column), {
      original: {
        id: 1,
        name: 'Alpha',
        active: true,
        statuses: ['active', 'review'],
        createdAt: '2024-01-01',
      },
      getValue: () => undefined,
    });

    expect(screen.getAllByText('active').length > 0).toBe(true);
    expect(Boolean(screen.getByText('+1'))).toBe(true);
    expect(Boolean(screen.getByTitle('active, review'))).toBe(true);
  });
});
