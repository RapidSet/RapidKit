import { useCallback, useState } from 'react';
import {
  DEFAULT_PAGINATION_PARAMS,
  type PaginationParams,
} from '@/lib/pagination';
import type { UseSearchPaginationReturn } from './types';

/**
 * Manages search and pagination parameters as a single state object.
 *
 * - `handleSearch` resets `page` to `1` and normalizes an empty query to `undefined`.
 * - `handlePaginationChange` replaces the full pagination object.
 *
 * Compose with `useDebounce` at the feature layer instead of coupling timing logic
 * into this hook:
 *
 * ```tsx
 * const [queryInput, setQueryInput] = useState('');
 * const debouncedQuery = useDebounce(queryInput, 300);
 *
 * useEffect(() => {
 *   handleSearch(debouncedQuery);
 * }, [debouncedQuery, handleSearch]);
 * ```
 */
export const useSearchPagination = (
  initialParams: PaginationParams = DEFAULT_PAGINATION_PARAMS,
): UseSearchPaginationReturn => {
  const [paginationParams, setPaginationParams] =
    useState<PaginationParams>(initialParams);

  const handleSearch = useCallback((query: string) => {
    setPaginationParams((previous) => ({
      ...previous,
      page: 1,
      query: query === '' ? undefined : query,
    }));
  }, []);

  const handlePaginationChange = useCallback((params: PaginationParams) => {
    setPaginationParams(params);
  }, []);

  return {
    paginationParams,
    handleSearch,
    handlePaginationChange,
  };
};
