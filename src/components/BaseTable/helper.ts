import { ColumnDef } from '@tanstack/react-table';
import { Column } from './components/BaseTableRow';
import type { ColumnBreakpoint } from './components/BaseTableRow/types';
import {
  ActionCell,
  AvatarCell,
  BooleanCell,
  CellType,
  ChipCell,
  DateCell,
  DimensionCell,
  IconCell,
  ImageCell,
  MultiStatusCell,
  StatusCell,
  TextCell,
} from './components/BaseTableRow/components/BaseTableCell';

export interface ResolveStickyOptions {
  responsive: boolean;
  enableSelection: boolean;
}

export interface StickyResolution {
  selectionSticky: 'left' | null;
  columnSticky: Record<string, 'left' | 'right' | undefined>;
}

const SHOW_FROM_CLASS: Record<ColumnBreakpoint, string> = {
  sm: 'hidden sm:table-cell',
  md: 'hidden md:table-cell',
  lg: 'hidden lg:table-cell',
  xl: 'hidden xl:table-cell',
  '2xl': 'hidden 2xl:table-cell',
};

/**
 * Maps a column's `showFrom` breakpoint to Tailwind utility classes that
 * hide the cell below the breakpoint and restore `display: table-cell`
 * at or above it. Returns an empty string when `showFrom` is undefined.
 *
 * The class map uses static literal strings so Tailwind's JIT detects
 * them during the `./src/**\/*.{ts,tsx}` content scan.
 */
export const getShowFromClass = (
  showFrom: ColumnBreakpoint | undefined,
): string => (showFrom ? SHOW_FROM_CLASS[showFrom] : '');

/**
 * Resolves which columns pin to the left or right edge of a horizontally
 * scrolling BaseTable.
 *
 * Rules:
 * 1. If `responsive` is false, nothing is sticky.
 * 2. Explicit `column.sticky` wins. If multiple columns claim the same side,
 *    the first declared wins and subsequent same-side claims are ignored.
 * 3. Inference fills the gaps:
 *    - Sticky-left: if no explicit left column, the selection column (when
 *      `enableSelection`) pins, otherwise the first data column with no
 *      `showFrom` pins. Columns with `showFrom` are skipped so the default
 *      anchor never disappears at narrow viewports.
 *    - Sticky-right: if no explicit right column, the last `CellType.ACTIONS`
 *      column with no `showFrom` pins. If none exists, nothing pins right.
 */
export const resolveStickyColumns = <T extends object>(
  columns: Column<T>[],
  { responsive, enableSelection }: ResolveStickyOptions,
): StickyResolution => {
  if (!responsive) {
    return { selectionSticky: null, columnSticky: {} };
  }

  const columnSticky: Record<string, 'left' | 'right' | undefined> = {};
  let explicitLeftId: string | null = null;
  let explicitRightId: string | null = null;

  for (const column of columns) {
    if (column.sticky === 'left' && explicitLeftId === null) {
      explicitLeftId = column.id;
      columnSticky[column.id] = 'left';
    } else if (column.sticky === 'right' && explicitRightId === null) {
      explicitRightId = column.id;
      columnSticky[column.id] = 'right';
    }
  }

  let selectionSticky: 'left' | null = null;
  if (explicitLeftId === null) {
    if (enableSelection) {
      selectionSticky = 'left';
    } else {
      const firstVisible = columns.find((column) => !column.showFrom);
      if (firstVisible) {
        columnSticky[firstVisible.id] = 'left';
      }
    }
  }

  if (explicitRightId === null) {
    for (let index = columns.length - 1; index >= 0; index -= 1) {
      const column = columns[index];
      if (
        column.type === CellType.ACTIONS &&
        !column.showFrom &&
        columnSticky[column.id] !== 'left'
      ) {
        columnSticky[column.id] = 'right';
        break;
      }
    }
  }

  return { selectionSticky, columnSticky };
};

export const transformColumns = <T extends object>(
  columns: Column<T>[],
): ColumnDef<T>[] => {
  return columns.map((column) => {
    switch (column.type) {
      case CellType.TEXT:
        return TextCell(column);
      case CellType.CHIP:
        return ChipCell(column);
      case CellType.STATUS:
        return StatusCell(column);
      case CellType.DATE:
        return DateCell(column);
      case CellType.ICON:
        return IconCell(column);
      case CellType.IMAGE:
        return ImageCell(column);
      case CellType.AVATAR:
        return AvatarCell(column);
      case CellType.ACTIONS:
        return ActionCell(column);
      case CellType.DIMENSION:
      case CellType.DIMENSTION:
        return DimensionCell(column);
      case CellType.BOOLEAN:
        return BooleanCell(column);
      case CellType.MULTI_STATUS:
        return MultiStatusCell(column);
      default:
        return TextCell(column);
    }
  });
};
