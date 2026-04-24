import type { PaginationParams } from '@/lib/pagination';

export type UseSearchPaginationReturn = {
  paginationParams: PaginationParams;
  handleSearch: (query: string) => void;
  handlePaginationChange: (params: PaginationParams) => void;
};
