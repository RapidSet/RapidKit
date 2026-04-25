import type {
  AccessConfig,
  AccessResolver,
  AccessRule,
} from '@lib/access-types';
import { Column } from './components/BaseTableRow';

export type BaseTableSortOrder = 'asc' | 'desc';

export type BaseTableAccessMode = 'view' | 'edit';
export type BaseTableAccessRule = AccessRule<BaseTableAccessMode>;
export type BaseTableAccessConfig = AccessConfig<BaseTableAccessMode>;
export type BaseTableAccessResolver = AccessResolver<
  BaseTableAccessMode,
  BaseTableAccessRule
>;

export interface BaseTableQueryParams {
  query: string;
  page: number;
  size: number;
}

export interface TableProps<T extends object> {
  data: T[];
  columns: Column<T>[];
  customRow?: Column<T>[];
  totalItems?: number;
  totalPages?: number;
  isLoading?: boolean;
  className?: string;
  placeholder?: string;
  queryParams?: BaseTableQueryParams;
  sortBy?: string;
  sortOrder?: BaseTableSortOrder;
  enableSelection?: boolean;
  access?: BaseTableAccessConfig;
  canAccess?: BaseTableAccessResolver;
  onRowClicked?: (item: T) => void;
  onSelectionChange?: (selectedItems: T[]) => void;
  onQueryParamsChange?: (params: BaseTableQueryParams) => void;
  onSortChange?: (sortBy: string, sortOrder: BaseTableSortOrder) => void;
  showDescriptor?: boolean;
  activeItem?: T | null;
  selectedItems?: T[];
  compactPagination?: boolean;
  getRowId?: (item: T, index: number) => string;
}
