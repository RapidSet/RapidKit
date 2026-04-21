import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ReactNode } from 'react';
import { Page } from './Page';

const { pageHeaderMock } = vi.hoisted(() => ({
  pageHeaderMock: vi.fn(),
}));

vi.mock('./components/PageHeader', () => ({
  PageHeader: (props: {
    actions?: unknown[];
    onSearch?: (value: string) => void;
    filterSlot?: ReactNode;
    className?: string;
    searchPlaceholder?: string;
  }) => {
    pageHeaderMock(props);
    return <div data-testid="page-header">Header</div>;
  },
}));

describe('Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders children and page header by default', () => {
    const onSearch = vi.fn();

    render(
      <Page onSearch={onSearch} searchPlaceholder="Search items">
        <div>Page content</div>
      </Page>,
    );

    expect(screen.getByTestId('page-header')).toBeTruthy();
    expect(screen.getByText('Page content')).toBeTruthy();
    expect(pageHeaderMock).toHaveBeenCalledWith(
      expect.objectContaining({
        onSearch,
        searchPlaceholder: 'Search items',
        className: 'w-full',
      }),
    );
  });

  it('does not render page header when enableSearch is false', () => {
    render(
      <Page enableSearch={false}>
        <div>Page content</div>
      </Page>,
    );

    expect(screen.queryByTestId('page-header')).toBeNull();
    expect(pageHeaderMock).not.toHaveBeenCalled();
  });

  it('applies custom className to container', () => {
    const { container } = render(
      <Page className="custom-page-class">
        <div>Page content</div>
      </Page>,
    );

    expect((container.firstChild as HTMLElement).className).toContain(
      'custom-page-class',
    );
    expect((container.firstChild as HTMLElement).className).toContain(
      'rounded-sm',
    );
  });
});
