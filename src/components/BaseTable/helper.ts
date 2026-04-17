import { ColumnDef } from '@tanstack/react-table';
import { Column } from './components/BaseTableRow';
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
