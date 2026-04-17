import React from 'react';
import { cn } from '@lib/utils';
import { Checkbox } from '@components/Checkbox';
import { Image } from '@components/Image';
import { RowProps } from './types';
import { CellType } from './components/BaseTableCell';
import {
  formatDateValue,
  resolveIconComponent,
  resolveLucideIconByName,
  toStatusLabel,
} from './components/BaseTableCell/helper';
import { getRowValue, isRowInactive, statusToneClass, toText } from './helper';
import { TableCell, TableRow } from '@/components/ui/table';

export const BaseTableRow = <T extends object>({
  item,
  columns,
  selected,
  onSelect,
  onClick,
  showSelection,
}: RowProps<T>) => {
  const maybeItemId = (item as { id?: unknown }).id;
  const rowId =
    typeof maybeItemId === 'string' || typeof maybeItemId === 'number'
      ? String(maybeItemId)
      : 'row';
  const columnWidth = columns.every((column) => column.width)
    ? undefined
    : `${100 / Math.max(columns.length, 1)}%`;
  const rowInactive = isRowInactive(item, columns);

  const renderRowCellContent = (column: RowProps<T>['columns'][number]) => {
    const rawValue = getRowValue(item, column);

    switch (column.type) {
      case CellType.IMAGE: {
        const imageSource = typeof rawValue === 'string' ? rawValue : '';
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
      }
      case CellType.AVATAR: {
        const initials = toText(rawValue)
          .split(' ')
          .filter(Boolean)
          .slice(0, 2)
          .map((segment: string) => segment[0]?.toUpperCase() ?? '')
          .join('');

        return (
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-muted text-[10px] font-semibold text-muted-foreground">
            {initials || '--'}
          </span>
        );
      }
      case CellType.DATE: {
        return (
          <span className="text-xs text-muted-foreground">
            {formatDateValue(rawValue)}
          </span>
        );
      }
      case CellType.STATUS:
      case CellType.CHIP: {
        const chipStyle = column.styler ? column.styler(rawValue) : '';
        return (
          <span
            className={cn(
              'inline-flex rounded-full bg-muted px-2 py-0.5 text-xs capitalize text-muted-foreground',
              chipStyle,
              column.className,
            )}
          >
            {toStatusLabel(rawValue)}
          </span>
        );
      }
      case CellType.BOOLEAN: {
        return (
          <span className="text-xs text-muted-foreground">
            {rawValue ? 'Yes' : 'No'}
          </span>
        );
      }
      case CellType.DIMENSTION: {
        return (
          <span className="text-xs text-muted-foreground">
            {toText(rawValue)}
          </span>
        );
      }
      case CellType.MULTI_STATUS: {
        if (!Array.isArray(rawValue) || rawValue.length === 0) {
          return <span className="text-xs text-muted-foreground">-</span>;
        }

        return (
          <div className="flex flex-wrap gap-1">
            {rawValue.map((status) => {
              const label = toStatusLabel(status);
              const className =
                status !== null &&
                status !== undefined &&
                typeof status === 'object' &&
                'className' in status &&
                typeof (status as { className?: unknown }).className ===
                  'string'
                  ? (status as { className: string }).className
                  : '';

              return (
                <span
                  key={`${column.id}-status-${label}-${className}`}
                  className={cn(
                    'inline-flex rounded-full bg-muted px-2 py-0.5 text-xs capitalize text-muted-foreground',
                    column.className,
                    className,
                  )}
                >
                  {label}
                </span>
              );
            })}
          </div>
        );
      }
      case CellType.ICON: {
        const Icon = resolveIconComponent(column, rawValue);
        if (!Icon) {
          return <span className="text-xs text-muted-foreground">-</span>;
        }

        return (
          <span className="inline-flex h-6 w-6 items-center justify-center text-muted-foreground">
            <Icon className="h-4 w-4" />
          </span>
        );
      }
      case CellType.ACTIONS: {
        if (!column.actions?.length) {
          return <span className="text-xs text-muted-foreground">-</span>;
        }

        return (
          <div className="flex flex-wrap items-center justify-end gap-1">
            {column.actions.map((action) => {
              const Icon = resolveLucideIconByName(action.iconName);

              return (
                <button
                  key={`${column.id}-${action.label}`}
                  type="button"
                  className="inline-flex items-center gap-1 rounded border px-2 py-1 text-xs hover:bg-muted"
                  disabled={rowInactive}
                  onClick={(event) => {
                    event.stopPropagation();
                    if (rowInactive) {
                      return;
                    }
                    action.onClick(item);
                  }}
                >
                  {Icon ? (
                    <Icon
                      className={cn(
                        'h-3.5 w-3.5',
                        statusToneClass(action.iconVariant),
                      )}
                    />
                  ) : null}
                  <span className={statusToneClass(action.iconVariant)}>
                    {action.label}
                  </span>
                </button>
              );
            })}
          </div>
        );
      }
      default:
        return (
          <span className="block truncate text-xs text-muted-foreground">
            {toText(rawValue)}
          </span>
        );
    }
  };

  return (
    <TableRow
      className={cn(
        'border-b transition-colors',
        rowInactive
          ? 'cursor-not-allowed opacity-60'
          : 'cursor-pointer hover:bg-muted/50',
        selected && 'bg-muted/80',
      )}
      aria-disabled={rowInactive}
      onClick={() => {
        if (rowInactive) {
          return;
        }
        onClick?.(item);
      }}
    >
      {showSelection ? (
        <TableCell className="w-10 px-2 py-2">
          <Checkbox
            aria-label="Select row"
            checked={Boolean(selected)}
            disabled={rowInactive}
            onCheckChange={(checked) => {
              if (rowInactive) {
                return;
              }
              onSelect?.(checked);
            }}
            onClick={(event) => event.stopPropagation()}
            name={`${rowId}-select`}
            className="h-4 w-4"
          />
        </TableCell>
      ) : null}
      {columns.map((column) => {
        return (
          <TableCell
            key={`${rowId}-${column.id}`}
            className={cn('px-3 py-2 text-xs', column.className)}
            style={{ width: column.width || columnWidth }}
          >
            {renderRowCellContent(column)}
          </TableCell>
        );
      })}
    </TableRow>
  );
};
