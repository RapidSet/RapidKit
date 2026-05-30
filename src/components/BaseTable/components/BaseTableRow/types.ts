import React from 'react';
import * as LucideIcons from 'lucide-react';
import type { AccessConfig } from '@lib/access-types';
import { CellType } from './components/BaseTableCell';
import { CellContext } from '@tanstack/react-table';
import type { IconVariant } from '@components/Icon/types';

export { CellType };

export type BaseTableColumnAccessConfig = AccessConfig<'view' | 'edit'>;

export type ColumnBreakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

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
  access?: BaseTableColumnAccessConfig;
  /**
   * Pin this column to the left or right edge of a horizontally scrolling
   * table. Explicit `sticky` overrides BaseTable's inferred sticky columns.
   * If multiple columns claim the same side, the first declared wins and
   * subsequent same-side claims are ignored.
   */
  sticky?: 'left' | 'right';
  /**
   * Hide this column on viewports narrower than the given Tailwind
   * breakpoint. Implemented with CSS responsive utilities — SSR-safe and
   * does not interact with TanStack's columnVisibility state.
   *
   * Breakpoints follow Tailwind defaults: sm=640, md=768, lg=1024,
   * xl=1280, 2xl=1536 (pixels).
   *
   * Columns with `showFrom` are skipped when BaseTable infers the default
   * sticky-left anchor or sticky-right action column. Explicit `sticky`
   * is unaffected and wins, but the column will still hide at narrow
   * widths — meaning no column will pin on that side there.
   */
  showFrom?: ColumnBreakpoint;
}

export interface RowAction<T extends object> {
  label: string;
  iconName?: LucideIconName;
  variant?: IconVariant;
  iconVariant?: IconVariant;
  onClick: (item: T) => void;
  access?: BaseTableColumnAccessConfig;
}
