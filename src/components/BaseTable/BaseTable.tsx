import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ColumnFiltersState,
  Row,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { cn } from '@lib/utils';
import { Checkbox } from '@components/Checkbox';
import type {
  BaseTableAccessResolver,
  BaseTableSortOrder,
  TableProps,
} from './types';
import { transformColumns } from './helper';
import { isRowInactive } from './components/BaseTableRow/helper';
import TablePlaceholder from './components/BaseTablePlaceHolder/BaseTablePlaceHolder';
import { DataTablePagination } from './components/Pagination/Pagination';

const canAccess = (
  requirements: string[] | undefined,
  resolveAccess: BaseTableAccessResolver | undefined,
  mode: 'view' | 'edit',
): boolean => {
  if (!requirements?.length || !resolveAccess) {
    return true;
  }

  return requirements.some((requirement) => resolveAccess(requirement, mode));
};

const resolveRowId = <T extends object>(
  item: T,
  index: number,
  getRowId?: (item: T, index: number) => string,
): string => {
  if (getRowId) {
    return getRowId(item, index);
  }

  const itemId = (item as { id?: unknown }).id;
  if (typeof itemId === 'string' || typeof itemId === 'number') {
    return String(itemId);
  }

  return String(index);
};

export const BaseTable = <T extends object>({
  data,
  columns,
  totalItems,
  totalPages,
  onSelectionChange,
  onPaginationChange,
  onSortChange,
  paginationParams,
  onRowClicked,
  customRow,
  enableSelection,
  isLoading,
  placeholder = 'No data available',
  showDescriptor = true,
  activeItem,
  selectedItems,
  compactPagination = false,
  className,
  accessRequirements,
  resolveAccess,
  getRowId,
}: TableProps<T>) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [activeRow, setActiveRow] = useState<string | null>(null);
  const isSyncingFromProp = useRef(false);

  const availableColumns = customRow ?? columns ?? [];

  const hasViewPermission = canAccess(
    accessRequirements,
    resolveAccess,
    'view',
  );
  const hasEditPermission = canAccess(
    accessRequirements,
    resolveAccess,
    'edit',
  );

  const initialSelection = useMemo(() => {
    if (!selectedItems?.length) {
      return {};
    }

    const selectedKeys = new Set(
      selectedItems.map((item, index) => resolveRowId(item, index, getRowId)),
    );

    return data.reduce<Record<string, boolean>>((acc, item, index) => {
      const rowId = resolveRowId(item, index, getRowId);
      if (selectedKeys.has(rowId)) {
        acc[rowId] = true;
      }
      return acc;
    }, {});
  }, [data, getRowId, selectedItems]);

  const table = useReactTable({
    data,
    columns: transformColumns(availableColumns),
    getRowId: (item, index) => resolveRowId(item, index, getRowId),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    manualPagination: true,
    pageCount: totalPages ?? -1,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: {
        pageIndex: Math.max((paginationParams?.page ?? 1) - 1, 0),
        pageSize: paginationParams?.size ?? 20,
      },
    },
  });

  const handleSelectAll = (isChecked: boolean) => {
    const newSelection = table
      .getRowModel()
      .rows.reduce<Record<string, boolean>>((acc, row) => {
        if (isRowInactive(row.original, availableColumns)) {
          return acc;
        }

        acc[row.id] = isChecked;
        return acc;
      }, {});
    setRowSelection(newSelection);
  };

  const handleSelectRow = (rowId: string, isChecked: boolean) => {
    setRowSelection((prev) => ({
      ...prev,
      [rowId]: isChecked,
    }));
  };

  const handlePageChange = (newPage: number) => {
    const boundedPage = Math.max(newPage, 1);
    table.setPageIndex(boundedPage - 1);
    onPaginationChange?.({
      ...paginationParams,
      page: boundedPage,
      size: paginationParams?.size ?? 20,
    });
  };

  const handlePageSizeChange = (newSize: number) => {
    const boundedSize = Math.max(newSize, 1);
    table.setPageSize(boundedSize);
    table.setPageIndex(0);
    onPaginationChange?.({
      ...paginationParams,
      size: boundedSize,
      page: 1,
    });
  };

  const handleRowClicked = (row: Row<T>) => {
    onRowClicked?.(row.original);
    setActiveRow(row.id);
  };

  const getNextSortOrder = (
    isSortedColumn: boolean,
    currentSortOrder: BaseTableSortOrder | undefined,
  ): BaseTableSortOrder => {
    if (isSortedColumn && currentSortOrder === 'asc') {
      return 'desc';
    }

    return 'asc';
  };

  useEffect(() => {
    if (!selectedItems) {
      return;
    }

    isSyncingFromProp.current = true;
    setRowSelection(initialSelection);
    const timeoutId = setTimeout(() => {
      isSyncingFromProp.current = false;
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [initialSelection, selectedItems]);

  useEffect(() => {
    if (!activeItem) {
      return;
    }

    const rowIndex = data.findIndex((item) => {
      const activeId = (activeItem as { id?: unknown }).id;
      const itemId = (item as { id?: unknown }).id;

      if (
        (typeof activeId !== 'string' && typeof activeId !== 'number') ||
        (typeof itemId !== 'string' && typeof itemId !== 'number')
      ) {
        return false;
      }

      return String(itemId) === String(activeId);
    });

    if (rowIndex !== -1) {
      setActiveRow(resolveRowId(data[rowIndex], rowIndex, getRowId));
    }
  }, [activeItem, data, getRowId]);

  useEffect(() => {
    const currentPageIndex = Math.max((paginationParams?.page ?? 1) - 1, 0);
    const currentPageSize = paginationParams?.size ?? 20;

    if (table.getState().pagination.pageIndex !== currentPageIndex) {
      table.setPageIndex(currentPageIndex);
    }
    if (table.getState().pagination.pageSize !== currentPageSize) {
      table.setPageSize(currentPageSize);
    }
  }, [paginationParams, table]);

  useEffect(() => {
    if (!onSelectionChange || isSyncingFromProp.current) {
      return;
    }

    const selectedRows = table
      .getRowModel()
      .rows.filter((row) => rowSelection[row.id]);
    onSelectionChange(selectedRows.map((row) => row.original));
  }, [onSelectionChange, rowSelection, table]);

  if (!hasViewPermission) {
    return null;
  }

  const rows = table.getRowModel().rows;
  const selectableRows = rows.filter(
    (row) => !isRowInactive(row.original, availableColumns),
  );
  const allRowsSelected =
    selectableRows.length > 0 &&
    selectableRows.every((row) => rowSelection[row.id]);

  return (
    <div
      className={cn(
        'relative flex h-full w-full flex-col overflow-hidden rounded-md border',
        className,
      )}
    >
      <table className="w-full border-collapse">
        <thead className="sticky top-0 z-10 bg-muted">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="border-b">
              {enableSelection ? (
                <th className="w-10 px-2 py-2 text-left">
                  <Checkbox
                    aria-label="Select all rows"
                    checked={allRowsSelected}
                    onCheckChange={(checked) => handleSelectAll(checked)}
                    disabled={!hasEditPermission}
                    name="select-all-rows"
                    className="h-4 w-4"
                  />
                </th>
              ) : null}
              {headerGroup.headers.map((header) => {
                const column = availableColumns.find(
                  (item) => item.id === header.id,
                );
                const isSortable = Boolean(column?.sortable && onSortChange);
                const currentSortBy = paginationParams?.sortBy;
                const currentSortOrder = paginationParams?.sortOrder;
                const isSorted = currentSortBy === header.id;
                let sortIndicator = '↕';
                if (isSorted) {
                  sortIndicator = currentSortOrder === 'asc' ? '↑' : '↓';
                }

                return (
                  <th
                    key={header.id}
                    className={cn(
                      'px-3 py-2 text-left text-xs font-semibold text-muted-foreground',
                      isSortable &&
                        'cursor-pointer select-none hover:bg-muted/70',
                    )}
                    onClick={() => {
                      if (!isSortable || !onSortChange) {
                        return;
                      }

                      const nextSortOrder = getNextSortOrder(
                        isSorted,
                        currentSortOrder,
                      );
                      onSortChange(header.id, nextSortOrder);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                      {isSortable ? (
                        <span
                          className={cn('text-xs', !isSorted && 'opacity-40')}
                        >
                          {sortIndicator}
                        </span>
                      ) : null}
                    </div>
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody className="relative min-h-[220px]">
          {rows.length ? (
            rows.map((row) => {
              const rowInactive = isRowInactive(row.original, availableColumns);

              return (
                <tr
                  key={row.id}
                  className={cn(
                    'border-b transition-colors',
                    rowInactive
                      ? 'cursor-not-allowed opacity-60'
                      : 'cursor-pointer hover:bg-muted/60',
                    activeRow === row.id && 'bg-muted/70',
                  )}
                  data-state={row.getIsSelected() ? 'selected' : undefined}
                  aria-disabled={rowInactive}
                  onClick={() => {
                    if (rowInactive) {
                      return;
                    }
                    handleRowClicked(row);
                  }}
                >
                  {enableSelection ? (
                    <td className="w-10 px-2 py-2">
                      <Checkbox
                        aria-label="Select row"
                        checked={Boolean(rowSelection[row.id])}
                        onCheckChange={(checked) =>
                          handleSelectRow(row.id, checked)
                        }
                        onClick={(event) => event.stopPropagation()}
                        disabled={!hasEditPermission || rowInactive}
                        name={`${row.id}-select`}
                        className="h-4 w-4"
                      />
                    </td>
                  ) : null}
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="max-w-[240px] truncate px-3 py-2 text-xs"
                      title={String(cell.getValue() ?? '')}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              );
            })
          ) : (
            <tr className="hover:bg-transparent">
              <td
                colSpan={availableColumns.length + (enableSelection ? 1 : 0)}
                className="h-[220px]"
              />
            </tr>
          )}
        </tbody>
      </table>
      {rows.length === 0 ? (
        <TablePlaceholder isLoading={isLoading} placeholder={placeholder} />
      ) : null}
      <div className="border-t bg-muted/70 p-1">
        <DataTablePagination
          enableSelection={Boolean(enableSelection)}
          selectedCount={Object.values(rowSelection).filter(Boolean).length}
          rowCount={rows.length}
          totalPages={totalPages}
          totalItems={totalItems}
          paginationParams={paginationParams}
          onPageSizeChange={handlePageSizeChange}
          onPageChange={handlePageChange}
          showDescriptor={showDescriptor}
          columnCount={compactPagination ? 2 : table.getAllColumns().length}
        />
      </div>
    </div>
  );
};
