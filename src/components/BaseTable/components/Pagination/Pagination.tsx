import { DataTablePaginationProps } from './types';

export function DataTablePagination({
  enableSelection = false,
  selectedCount = 0,
  rowCount = 0,
  onPageSizeChange,
  onPageChange,
  paginationParams,
  totalItems,
  totalPages,
  showDescriptor = true,
  columnCount = 3,
}: Readonly<DataTablePaginationProps>) {
  const pageSizeOptions = [10, 20, 30, 40, 50];
  const currentPage = Math.max(paginationParams?.page ?? 1, 1);
  const currentSize = Math.max(paginationParams?.size ?? 10, 1);
  const availablePages = Math.max(totalPages ?? 1, 1);
  const isCompact = columnCount <= 3;

  if (isCompact) {
    return (
      <div className="flex w-full items-center justify-end gap-2 overflow-auto p-1">
        <button
          type="button"
          aria-label="Go to previous page"
          className="h-8 min-w-8 rounded border px-2 text-xs disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          {'<'}
        </button>
        <p className="whitespace-nowrap text-xs">{`${currentPage} / ${availablePages}`}</p>
        <button
          type="button"
          aria-label="Go to next page"
          className="h-8 min-w-8 rounded border px-2 text-xs disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= availablePages}
        >
          {'>'}
        </button>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col-reverse items-center justify-end gap-4 overflow-auto p-1 sm:flex-row sm:gap-8">
      {enableSelection ? (
        <div className="flex-1 whitespace-nowrap text-sm text-muted-foreground">
          {selectedCount} of {rowCount} row(s) selected.
        </div>
      ) : null}
      <div className="flex flex-col-reverse items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
        {showDescriptor ? (
          <div className="text-sm text-muted-foreground">
            {totalItems !== undefined && totalItems > 0 ? (
              <>
                Showing{' '}
                {Math.min((currentPage - 1) * currentSize + 1, totalItems)} -{' '}
                {Math.min(currentPage * currentSize, totalItems)} of{' '}
                {totalItems} items
              </>
            ) : (
              'No items'
            )}
          </div>
        ) : null}
        <div className="flex items-center gap-2">
          <label
            htmlFor="base-table-page-size"
            className="whitespace-nowrap text-sm font-medium"
          >
            Rows per page
          </label>
          <select
            id="base-table-page-size"
            className="h-8 rounded border px-2 text-xs"
            value={String(currentSize)}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
          >
            {pageSizeOptions.map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Go to first page"
            className="hidden h-8 min-w-8 rounded border px-2 text-xs lg:flex disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => onPageChange(1)}
            disabled={currentPage <= 1}
          >
            {'<<'}
          </button>
          <button
            type="button"
            aria-label="Go to previous page"
            className="h-8 min-w-8 rounded border px-2 text-xs disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            {'<'}
          </button>
          <p className="whitespace-nowrap text-xs">{`${currentPage} / ${availablePages}`}</p>
          <button
            type="button"
            aria-label="Go to next page"
            className="h-8 min-w-8 rounded border px-2 text-xs disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= availablePages}
          >
            {'>'}
          </button>
          <button
            type="button"
            aria-label="Go to last page"
            className="hidden h-8 min-w-8 rounded border px-2 text-xs lg:flex disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => onPageChange(availablePages)}
            disabled={currentPage >= availablePages}
          >
            {'>>'}
          </button>
        </div>
      </div>
    </div>
  );
}
