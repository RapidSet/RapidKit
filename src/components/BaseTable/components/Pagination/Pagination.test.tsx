import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { DataTablePagination } from './Pagination';
import type { DataTablePaginationProps } from './types';

const createProps = (): DataTablePaginationProps => {
  return {
    enableSelection: true,
    selectedCount: 2,
    rowCount: 4,
    totalItems: 45,
    totalPages: 5,
    paginationParams: { page: 2, size: 10 },
    onPageChange: vi.fn(),
    onPageSizeChange: vi.fn(),
    showDescriptor: true,
    columnCount: 5,
  };
};

describe('DataTablePagination', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders compact mode and navigates pages', () => {
    const props = createProps();

    render(<DataTablePagination {...props} columnCount={2} />);

    fireEvent.click(screen.getByRole('button', { name: 'Go to next page' }));
    expect(props.onPageChange).toHaveBeenCalledWith(3);

    fireEvent.click(
      screen.getByRole('button', { name: 'Go to previous page' }),
    );
    expect(props.onPageChange).toHaveBeenCalledWith(1);
  });

  it('renders full mode descriptor and selection summary', () => {
    const props = createProps();

    render(<DataTablePagination {...props} />);

    expect(Boolean(screen.getByText('2 of 4 row(s) selected.'))).toBe(true);
    expect(Boolean(screen.getByText('Showing 11 - 20 of 45 items'))).toBe(true);
  });

  it('calls onPageSizeChange when page size is selected', () => {
    const props = createProps();

    render(<DataTablePagination {...props} />);

    fireEvent.change(screen.getByLabelText('Rows per page'), {
      target: { value: '30' },
    });

    expect(props.onPageSizeChange).toHaveBeenCalledWith(30);
  });
});
