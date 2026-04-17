import type { Column } from './types';
import type { IconVariant } from '@components/Icon/types';

const isObjectLike = (value: unknown): value is Record<string, unknown> => {
  return value !== null && value !== undefined && typeof value === 'object';
};

export const getByPath = (source: object, accessor?: string): unknown => {
  if (!accessor) {
    return '';
  }

  return accessor.split('.').reduce<unknown>((value, segment) => {
    if (!isObjectLike(value)) {
      return '';
    }

    return value[segment];
  }, source);
};

export const toText = (value: unknown): string => {
  if (value === null || value === undefined || value === '') {
    return '-';
  }

  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return String(value);
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  return '-';
};

export const getRowValue = <T extends object>(
  item: T,
  column: Column<T>,
): unknown => {
  if (
    column.combinationAccessorKeys &&
    column.combinationAccessorKeys.length > 0
  ) {
    return column.combinationAccessorKeys
      .map((key) => getByPath(item, String(key)))
      .filter(
        (value) =>
          typeof value === 'string' ||
          typeof value === 'number' ||
          typeof value === 'boolean',
      )
      .map(String)
      .join(' ');
  }

  return getByPath(
    item,
    column.accessorKey ? String(column.accessorKey) : undefined,
  );
};

export const isRowInactive = <T extends object>(
  item: T,
  columns: Column<T>[],
): boolean => {
  return columns.some((column) => {
    if (!column.isInactive) {
      return false;
    }

    const value = getRowValue(item, column);
    if (typeof column.isInactive === 'function') {
      return column.isInactive(value, item);
    }

    return Boolean(value);
  });
};

export const statusToneClass = (variant?: IconVariant): string => {
  if (variant === 'danger') {
    return 'text-destructive';
  }
  if (variant === 'success') {
    return 'text-primary';
  }
  if (variant === 'warning') {
    return 'text-foreground';
  }
  if (variant === 'primary') {
    return 'text-primary';
  }
  return 'text-muted-foreground';
};
