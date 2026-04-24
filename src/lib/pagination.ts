export type ApiSortOrder = 'asc' | 'desc';

export interface PaginationParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortOrder?: ApiSortOrder;
  query?: string | null;
  meta?: object;
}

export type PaginatedResponse<T> = {
  items: T[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
};

export const DEFAULT_PAGINATED_RESPONSE: PaginatedResponse<unknown> = {
  items: [],
  totalItems: 0,
  currentPage: 1,
  totalPages: 1,
  itemsPerPage: 20,
};

export const DEFAULT_PAGINATION_PARAMS: PaginationParams = {
  page: 1,
  size: 20,
  query: '',
};

export const DEFAULT_PAGINATION_PARAM = DEFAULT_PAGINATION_PARAMS;
