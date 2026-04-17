import { cn } from '@lib/utils';

interface DataTableSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  columnCount: number;
  rowCount?: number;
  withPagination?: boolean;
}

export function DataTableSkeleton({
  columnCount,
  rowCount = 10,
  withPagination = true,
  className,
  ...props
}: Readonly<DataTableSkeletonProps>) {
  const columnKeys = Array.from(
    { length: columnCount },
    (_, index) => `column-${index + 1}`,
  );
  const rowKeys = Array.from(
    { length: rowCount },
    (_, index) => `row-${index + 1}`,
  );

  return (
    <div
      className={cn('w-full space-y-2.5 overflow-auto', className)}
      {...props}
    >
      <div className="rounded-md border">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {columnKeys.map((columnKey) => (
                <th key={`header-${columnKey}`} className="px-3 py-2">
                  <div className="h-6 w-full animate-pulse rounded bg-muted" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rowKeys.map((rowKey) => (
              <tr key={rowKey}>
                {columnKeys.map((columnKey) => (
                  <td key={`cell-${rowKey}-${columnKey}`} className="px-3 py-2">
                    <div className="h-5 w-full animate-pulse rounded bg-muted" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {withPagination ? (
        <div className="flex items-center justify-between gap-2">
          <div className="h-7 w-40 animate-pulse rounded bg-muted" />
          <div className="h-7 w-32 animate-pulse rounded bg-muted" />
        </div>
      ) : null}
    </div>
  );
}
