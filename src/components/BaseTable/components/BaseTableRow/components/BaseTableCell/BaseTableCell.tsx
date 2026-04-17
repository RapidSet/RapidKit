import { ColumnDef } from '@tanstack/react-table';
import { cn } from '@lib/utils';
import { Image } from '@components/Image';
import { Column } from '@components/BaseTable/components/BaseTableRow/types';
import {
  formatDateValue,
  getNestedValue,
  getRawValue,
  resolveIconComponent,
  resolveLucideIconByName,
  toStatusLabel,
} from './helper';

export const TextCell = <T extends object>(column: Column<T>): ColumnDef<T> => {
  return {
    id: column.id,
    accessorKey: column.accessorKey,
    header: column.header,
    cell: column.cell
      ? column.cell
      : ({ row }) => (
          <span className={cn('block truncate text-xs', column.className)}>
            {getNestedValue(row, column)}
          </span>
        ),
    enableSorting: Boolean(column.sortable),
    enableHiding: Boolean(column.filterable),
  };
};

export const ActionCell = <T extends object>(
  column: Column<T>,
): ColumnDef<T> => {
  return {
    id: column.id,
    accessorKey: column.accessorKey,
    header: column.header,
    enableSorting: false,
    enableHiding: Boolean(column.filterable),
    cell: ({ row }) => {
      if (!column.actions?.length) {
        return null;
      }

      return (
        <div className="flex items-center justify-end gap-2">
          {column.actions.map((action) => {
            const Icon = resolveLucideIconByName(action.iconName);
            return (
              <button
                key={`${column.id}-${action.label}`}
                type="button"
                className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs hover:bg-muted"
                onClick={(e) => {
                  e.stopPropagation();
                  action.onClick(row.original);
                }}
              >
                {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
                {action.label}
              </button>
            );
          })}
        </div>
      );
    },
  };
};

export const ImageCell = <T extends object>(
  column: Column<T>,
): ColumnDef<T> => {
  return {
    id: column.id,
    header: column.header,
    accessorKey: column.accessorKey,
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => {
      const source = getRawValue(row, column);
      const imageSource = typeof source === 'string' ? source : '';
      return imageSource ? (
        <Image
          src={imageSource}
          alt={column.header}
          size="sm"
          className="rounded object-cover"
          loading="lazy"
        />
      ) : (
        <span className="text-xs text-muted-foreground">-</span>
      );
    },
  };
};

export const AvatarCell = <T extends object>(
  column: Column<T>,
): ColumnDef<T> => {
  return {
    id: column.id,
    header: column.header,
    accessorKey: column.accessorKey,
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => {
      const value = getNestedValue(row, column);
      const initials = value
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((segment) => segment[0]?.toUpperCase() ?? '')
        .join('');

      return (
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-muted text-[10px] font-semibold text-muted-foreground">
          {initials || '--'}
        </span>
      );
    },
  };
};

export const ChipCell = <T extends object>(column: Column<T>): ColumnDef<T> => {
  return {
    id: column.id,
    accessorKey: column.accessorKey,
    header: column.header,
    enableColumnFilter: Boolean(column.filterable),
    enableHiding: Boolean(column.filterable),
    cell: column.cell
      ? column.cell
      : ({ row }) => {
          const displayValue = getNestedValue(row, column);
          const rawValue = getRawValue(row, column);
          const conditionalStyle = column.styler ? column.styler(rawValue) : '';
          return (
            <span
              className={cn(
                'inline-flex rounded-full bg-muted px-2 py-0.5 text-xs capitalize text-muted-foreground',
                column.className,
                conditionalStyle,
              )}
            >
              {displayValue}
            </span>
          );
        },
  };
};

export const StatusCell = <T extends object>(
  column: Column<T>,
): ColumnDef<T> => {
  return {
    id: column.id,
    accessorKey: column.accessorKey,
    header: column.header,
    enableColumnFilter: Boolean(column.filterable),
    enableHiding: Boolean(column.filterable),
    cell: column.cell
      ? column.cell
      : ({ row }) => {
          const rawValue = getRawValue(row, column);
          const label = toStatusLabel(rawValue);
          const conditionalStyle = column.styler ? column.styler(rawValue) : '';

          return (
            <span
              className={cn(
                'inline-flex rounded-full bg-muted px-2 py-0.5 text-xs capitalize text-muted-foreground',
                column.className,
                conditionalStyle,
              )}
            >
              {label}
            </span>
          );
        },
  };
};

export const IconCell = <T extends object>(column: Column<T>): ColumnDef<T> => {
  return {
    id: column.id,
    accessorKey: column.accessorKey,
    header: column.header,
    enableSorting: Boolean(column.sortable),
    enableHiding: Boolean(column.filterable),
    cell: column.cell
      ? column.cell
      : ({ row }) => {
          const rawValue = getRawValue(row, column);
          const Icon = resolveIconComponent(column, rawValue);
          const title = getNestedValue(row, column);

          if (!Icon) {
            return <span className="text-xs text-muted-foreground">-</span>;
          }

          return (
            <span
              className={cn(
                'inline-flex h-6 w-6 items-center justify-center rounded text-muted-foreground',
                column.className,
              )}
              title={title}
            >
              <Icon className="h-4 w-4" />
            </span>
          );
        },
  };
};

export const DateCell = <T extends object>(column: Column<T>): ColumnDef<T> => {
  return {
    id: column.id,
    accessorKey: column.accessorKey,
    header: column.header,
    enableColumnFilter: Boolean(column.filterable),
    enableHiding: Boolean(column.filterable),
    cell: column.cell
      ? column.cell
      : ({ row }) => {
          const rawValue = getRawValue(row, column);
          const dateValue = formatDateValue(rawValue);
          return (
            <span
              className="block truncate text-xs text-muted-foreground"
              title={dateValue}
            >
              {dateValue}
            </span>
          );
        },
  };
};

export const DimensionCell = <T extends object>(
  column: Column<T>,
): ColumnDef<T> => {
  return {
    id: column.id,
    header: column.header,
    enableColumnFilter: Boolean(column.filterable),
    enableHiding: Boolean(column.filterable),
    cell: ({ row }) => {
      const rawValue = getRawValue(row, column);
      if (typeof rawValue === 'string' && rawValue.length > 0) {
        return (
          <span
            className={cn('text-xs text-muted-foreground', column.className)}
          >
            {rawValue}
          </span>
        );
      }

      return <span className="text-xs text-muted-foreground">-</span>;
    },
  };
};

export const BooleanCell = <T extends object>(
  column: Column<T>,
): ColumnDef<T> => {
  return {
    id: column.id,
    accessorKey: column.accessorKey,
    header: column.header,
    enableColumnFilter: Boolean(column.filterable),
    enableHiding: Boolean(column.filterable),
    cell: ({ row }) => {
      const rawValue = getRawValue(row, column);
      return (
        <span className="text-xs text-muted-foreground">
          {rawValue ? 'Yes' : 'No'}
        </span>
      );
    },
  };
};

export const MultiStatusCell = <T extends object>(
  column: Column<T>,
): ColumnDef<T> => {
  return {
    id: column.id,
    accessorKey: column.accessorKey,
    header: column.header,
    enableColumnFilter: Boolean(column.filterable),
    enableHiding: Boolean(column.filterable),
    cell: column.cell
      ? column.cell
      : ({ row }) => {
          const statuses = getRawValue(row, column);

          if (!Array.isArray(statuses) || statuses.length === 0) {
            return <span className="text-xs text-muted-foreground">-</span>;
          }

          const labels = statuses.map((status) =>
            typeof status === 'string' ? status : String(status),
          );

          return (
            <div className="flex items-center gap-2" title={labels.join(', ')}>
              <span className="text-xs capitalize text-muted-foreground">
                {labels[0]}
              </span>
              {labels.length > 1 ? (
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-muted px-1.5 text-xs text-muted-foreground">
                  +{labels.length - 1}
                </span>
              ) : null}
            </div>
          );
        },
  };
};

export { CellType } from './types';
