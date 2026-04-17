import React from 'react';
import * as LucideIcons from 'lucide-react';
import { CellType } from './components/BaseTableCell';
import { CellContext } from '@tanstack/react-table';
import type { IconVariant } from '@components/Icon/types';

export interface RowProps<T extends object> {
  item: T;
  columns: Column<T>[];
  selected?: boolean;
  onSelect?: (checked: boolean) => void;
  onClick?: (item: T) => void;
  showSelection?: boolean;
}

export type LucideIconName = {
  [K in keyof typeof LucideIcons]: (typeof LucideIcons)[K] extends React.ComponentType<{
    className?: string;
  }>
    ? K
    : never;
}[keyof typeof LucideIcons];

type NestedKeyOf<T> = {
  [K in keyof T & (string | number)]: T[K] extends object | undefined
    ? T[K] extends (infer U)[]
      ? `${K}` | `${K}.${number}` | `${K}.${number}.${NestedKeyOf<U>}`
      : T[K] extends object | undefined
        ? `${K}` | `${K}.${NestedKeyOf<NonNullable<T[K]>>}`
        : `${K}`
    : `${K}`;
}[keyof T & (string | number)];

export interface Column<T extends object> {
  id: string;
  header: string;
  accessorKey?: NestedKeyOf<T>;
  type: CellType;
  isInactive?: boolean | ((value: unknown, item: T) => boolean);
  actions?: RowAction<T>[];
  iconName?: LucideIconName;
  iconNameMapper?: (value: unknown) => LucideIconName | undefined;
  width?: string;
  sortable?: boolean;
  filterable?: boolean;
  className?: string;
  combinationAccessorKeys?: NestedKeyOf<T>[];
  cell?: (context: CellContext<T, unknown>) => React.JSX.Element;
  transformer?: (value: unknown) => string;
  styler?: (value: unknown) => string;
  accessRequirements?: string[];
}

export interface RowAction<T extends object> {
  label: string;
  iconName?: LucideIconName;
  iconVariant?: IconVariant;
  onClick: (item: T) => void;
  accessRequirements?: string[];
}
