import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import TablePlaceholder from './BaseTablePlaceHolder';

describe('TablePlaceholder', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders placeholder text when not loading', () => {
    render(
      <TablePlaceholder isLoading={false} placeholder="No records found" />,
    );

    expect(Boolean(screen.getByText('No records found'))).toBe(true);
  });

  it('renders loading spinner and hides placeholder text when loading', () => {
    const { container } = render(
      <TablePlaceholder isLoading placeholder="No records found" />,
    );

    expect(screen.queryByText('No records found')).toBeNull();
    expect(container.querySelector('.animate-spin')).not.toBeNull();
  });
});
