import { BaseTableQueryParams } from '@components/BaseTable/types';

export interface DataTablePaginationProps {
  enableSelection?: boolean;
  selectedCount?: number;
  rowCount?: number;
  totalPages?: number;
  totalItems?: number;
  queryParams?: BaseTableQueryParams;
  onPageChange: (page: number) => void;
  onSizeChange: (size: number) => void;
  showDescriptor?: boolean;
  columnCount?: number;
}
