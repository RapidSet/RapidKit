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
import { CellType } from './components/BaseTableRow/components/BaseTableCell';
import { transformColumns } from './helper';
import { isRowInactive } from './components/BaseTableRow/helper';
import TablePlaceholder from './components/BaseTablePlaceHolder/BaseTablePlaceHolder';
import { DataTablePagination } from './components/Pagination/Pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@ui/table';

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
  onQueryParamsChange,
  onSortChange,
  queryParams,
  sortBy,
  sortOrder,
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
        pageIndex: Math.max((queryParams?.page ?? 1) - 1, 0),
        pageSize: queryParams?.size ?? 20,
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
    onQueryParamsChange?.({
      ...queryParams,
      query: queryParams?.query ?? '',
      page: boundedPage,
      size: queryParams?.size ?? 20,
    });
  };

  const handleSizeChange = (newSize: number) => {
    const boundedSize = Math.max(newSize, 1);
    table.setPageSize(boundedSize);
    table.setPageIndex(0);
    onQueryParamsChange?.({
      ...queryParams,
      query: queryParams?.query ?? '',
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
    const currentPageIndex = Math.max((queryParams?.page ?? 1) - 1, 0);
    const currentPageSize = queryParams?.size ?? 20;

    if (table.getState().pagination.pageIndex !== currentPageIndex) {
      table.setPageIndex(currentPageIndex);
    }
    if (table.getState().pagination.pageSize !== currentPageSize) {
      table.setPageSize(currentPageSize);
    }
  }, [queryParams, table]);

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
        'relative flex h-full w-full flex-col overflow-hidden rounded-xl border border-[hsl(var(--mz-control-border))] bg-background shadow-sm',
        className,
      )}
    >
      <Table className="w-full min-w-full border-collapse text-sm">
        <TableHeader className="sticky top-0 z-10 bg-muted/60 backdrop-blur supports-[backdrop-filter]:bg-muted/45">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="border-b border-[hsl(var(--mz-control-border))] hover:bg-transparent"
            >
              {enableSelection ? (
                <TableHead className="w-12 px-3 py-3 text-left">
                  <Checkbox
                    aria-label="Select all rows"
                    checked={allRowsSelected}
                    onCheckChange={(checked) => handleSelectAll(checked)}
                    disabled={!hasEditPermission}
                    name="select-all-rows"
                    className="h-4 w-4"
                  />
                </TableHead>
              ) : null}
              {headerGroup.headers.map((header) => {
                const column = availableColumns.find(
                  (item) => item.id === header.id,
                );
                const isActionColumn = column?.type === CellType.ACTIONS;
                const isSortable = Boolean(column?.sortable && onSortChange);
                const isSorted = sortBy === header.id;
                let sortIndicator = '↕';
                if (isSorted) {
                  sortIndicator = sortOrder === 'asc' ? '↑' : '↓';
                }

                return (
                  <TableHead
                    key={header.id}
                    className={cn(
                      'h-12 px-4 py-3 text-left text-xs font-medium text-muted-foreground',
                      isActionColumn && 'w-14 px-4 text-right',
                      isSortable &&
                        'cursor-pointer select-none transition-colors hover:bg-muted/70 hover:text-foreground',
                    )}
                    onClick={() => {
                      if (!isSortable || !onSortChange) {
                        return;
                      }

                      const nextSortOrder = getNextSortOrder(
                        isSorted,
                        sortOrder,
                      );
                      onSortChange(header.id, nextSortOrder);
                    }}
                  >
                    <div
                      className={cn(
                        'flex items-center gap-2',
                        isActionColumn && 'justify-end',
                      )}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                      {isSortable ? (
                        <span
                          className={cn(
                            'text-[10px] leading-none',
                            !isSorted && 'opacity-35',
                          )}
                        >
                          {sortIndicator}
                        </span>
                      ) : null}
                    </div>
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className="relative min-h-[220px] [&_tr:last-child]:border-0">
          {rows.length ? (
            rows.map((row) => {
              const rowInactive = isRowInactive(row.original, availableColumns);

              return (
                <TableRow
                  key={row.id}
                  className={cn(
                    'border-b border-[hsl(var(--mz-control-border))] bg-background transition-colors',
                    rowInactive
                      ? 'cursor-not-allowed bg-muted/35 text-muted-foreground opacity-65'
                      : 'cursor-pointer hover:bg-muted/45',
                    activeRow === row.id && 'bg-muted/65',
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
                    <TableCell className="w-12 px-3 py-3 align-middle">
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
                    </TableCell>
                  ) : null}
                  {row.getVisibleCells().map((cell) => {
                    const column = availableColumns.find(
                      (item) => item.id === cell.column.id,
                    );
                    const isActionColumn = column?.type === CellType.ACTIONS;

                    return (
                      <TableCell
                        key={cell.id}
                        className={cn(
                          'px-4 py-3 text-xs align-middle text-foreground',
                          isActionColumn
                            ? 'w-14 text-right'
                            : 'max-w-[240px] truncate text-foreground',
                        )}
                        title={
                          isActionColumn
                            ? undefined
                            : String(cell.getValue() ?? '')
                        }
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })
          ) : (
            <TableRow className="bg-background hover:bg-transparent">
              <TableCell
                colSpan={availableColumns.length + (enableSelection ? 1 : 0)}
                className="h-[220px]"
              />
            </TableRow>
          )}
        </TableBody>
      </Table>
      {rows.length === 0 ? (
        <TablePlaceholder isLoading={isLoading} placeholder={placeholder} />
      ) : null}
      <div className="border-t border-[hsl(var(--mz-control-border))] bg-muted/35 px-2 py-1.5">
        <DataTablePagination
          enableSelection={Boolean(enableSelection)}
          selectedCount={Object.values(rowSelection).filter(Boolean).length}
          rowCount={rows.length}
          totalPages={totalPages}
          totalItems={totalItems}
          queryParams={queryParams}
          onSizeChange={handleSizeChange}
          onPageChange={handlePageChange}
          showDescriptor={showDescriptor}
          columnCount={compactPagination ? 2 : table.getAllColumns().length}
        />
      </div>
    </div>
  );
};
