import { DataTablePaginationProps } from './types';

export function DataTablePagination({
  enableSelection = false,
  selectedCount = 0,
  rowCount = 0,
  onSizeChange,
  onPageChange,
  queryParams,
  totalItems,
  totalPages,
  showDescriptor = true,
  columnCount = 3,
}: Readonly<DataTablePaginationProps>) {
  const sizeOptions = [10, 20, 30, 40, 50];
  const currentPage = Math.max(queryParams?.page ?? 1, 1);
  const currentSize = Math.max(queryParams?.size ?? 10, 1);
  const availablePages = Math.max(totalPages ?? 1, 1);
  const isCompact = columnCount <= 3;
  const controlClassName =
    'inline-flex h-[var(--rk-control-height)] min-w-[var(--rk-control-height)] items-center justify-center rounded-md border-0 bg-transparent px-2.5 text-xs font-medium text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-45';
  const pageValueClassName =
    'inline-flex h-[var(--rk-control-height)] min-w-[4rem] items-center justify-center rounded-md border border-transparent px-2 text-xs font-medium text-muted-foreground';
  const selectClassName =
    'h-[var(--rk-control-height)] rounded-md border-0 bg-background px-2.5 text-xs text-foreground shadow-sm outline-none transition-colors focus:shadow-[var(--rk-control-shadow-focus)]';

  if (isCompact) {
    return (
      <div className="flex w-full items-center justify-end gap-2 overflow-auto px-3 py-2 sm:px-4">
        <button
          type="button"
          aria-label="Go to previous page"
          className={controlClassName}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          {'<'}
        </button>
        <p
          className={pageValueClassName}
        >{`${currentPage} / ${availablePages}`}</p>
        <button
          type="button"
          aria-label="Go to next page"
          className={controlClassName}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= availablePages}
        >
          {'>'}
        </button>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col-reverse items-center justify-between gap-3 overflow-auto px-3 py-2 sm:flex-row sm:gap-6 sm:px-4">
      {enableSelection ? (
        <div className="flex-1 whitespace-nowrap text-sm text-muted-foreground">
          {selectedCount} of {rowCount} row(s) selected.
        </div>
      ) : null}
      <div className="flex flex-col-reverse items-center gap-3 sm:flex-row sm:gap-5 lg:gap-6">
        {showDescriptor ? (
          <div className="whitespace-nowrap text-sm text-muted-foreground">
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
            className="whitespace-nowrap text-sm font-medium text-muted-foreground"
          >
            Rows per page
          </label>
          <select
            id="base-table-page-size"
            className={selectClassName}
            value={String(currentSize)}
            onChange={(event) => onSizeChange(Number(event.target.value))}
          >
            {sizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Go to first page"
            className={`hidden lg:inline-flex ${controlClassName}`}
            onClick={() => onPageChange(1)}
            disabled={currentPage <= 1}
          >
            {'<<'}
          </button>
          <button
            type="button"
            aria-label="Go to previous page"
            className={controlClassName}
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            {'<'}
          </button>
          <p
            className={pageValueClassName}
          >{`${currentPage} / ${availablePages}`}</p>
          <button
            type="button"
            aria-label="Go to next page"
            className={controlClassName}
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= availablePages}
          >
            {'>'}
          </button>
          <button
            type="button"
            aria-label="Go to last page"
            className={`hidden lg:inline-flex ${controlClassName}`}
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
