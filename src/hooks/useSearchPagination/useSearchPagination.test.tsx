import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  DEFAULT_PAGINATION_PARAMS,
  type PaginationParams,
} from '@/lib/pagination';
import { useSearchPagination } from './useSearchPagination';

describe('useSearchPagination', () => {
  it('initializes with default pagination params', () => {
    const { result } = renderHook(() => useSearchPagination());

    expect(result.current.paginationParams).toEqual(DEFAULT_PAGINATION_PARAMS);
  });

  it('initializes with provided pagination params', () => {
    const initialParams: PaginationParams = {
      page: 3,
      size: 50,
      query: 'invoice',
    };

    const { result } = renderHook(() => useSearchPagination(initialParams));

    expect(result.current.paginationParams).toEqual(initialParams);
  });

  it('updates query and resets page when searching', () => {
    const { result } = renderHook(() =>
      useSearchPagination({
        page: 5,
        size: 20,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      }),
    );

    act(() => {
      result.current.handleSearch('alpha');
    });

    expect(result.current.paginationParams).toEqual({
      page: 1,
      size: 20,
      sortBy: 'createdAt',
      sortOrder: 'desc',
      query: 'alpha',
    });
  });

  it('normalizes empty query to undefined', () => {
    const { result } = renderHook(() =>
      useSearchPagination({
        page: 2,
        size: 20,
        query: 'seed',
      }),
    );

    act(() => {
      result.current.handleSearch('');
    });

    expect(result.current.paginationParams.query).toBeUndefined();
    expect(result.current.paginationParams.page).toBe(1);
  });

  it('replaces params on pagination change', () => {
    const { result } = renderHook(() => useSearchPagination());

    const nextParams: PaginationParams = {
      page: 4,
      size: 10,
      sortBy: 'name',
      sortOrder: 'asc',
      query: 'rapid',
    };

    act(() => {
      result.current.handlePaginationChange(nextParams);
    });

    expect(result.current.paginationParams).toEqual(nextParams);
  });
});
