import { BaseTablePaginationParams } from '@components/BaseTable/types';

export interface DataTablePaginationProps {
  enableSelection?: boolean;
  selectedCount?: number;
  rowCount?: number;
  totalPages?: number;
  totalItems?: number;
  paginationParams?: BaseTablePaginationParams;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  showDescriptor?: boolean;
  columnCount?: number;
}
