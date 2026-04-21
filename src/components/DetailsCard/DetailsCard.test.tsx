import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MoreVertical } from 'lucide-react';
import { DetailsCard } from './DetailsCard';

vi.mock('./components/DetailsCardHeader/DetailsCardHeader', () => ({
  DetailsCardHeader: ({ title }: { title: string }) => (
    <div data-testid="details-card-header">{title}</div>
  ),
}));

vi.mock('./components/DetailsCardBody/DetailsCardBody', () => ({
  DetailsCardBody: ({
    isLoading,
    tabs,
  }: {
    isLoading: boolean;
    tabs: unknown[];
  }) => (
    <div data-testid="details-card-body">
      loading:{String(isLoading)} tabs:{tabs.length}
    </div>
  ),
}));

interface TestData {
  id: number;
}

describe('DetailsCard', () => {
  afterEach(() => {
    cleanup();
  });

  it('uses rounded-sm card corners to match control surfaces', () => {
    const { container } = render(
      <DetailsCard<TestData>
        icon={MoreVertical}
        title="Resource"
        isLoading={false}
        isPolling={false}
      />,
    );

    const card = container.firstElementChild;
    expect(card).toBeTruthy();
    expect(card?.className).toContain('rounded-sm');
  });

  it('always renders header', () => {
    const { container } = render(
      <DetailsCard<TestData>
        icon={MoreVertical}
        title="Resource"
        isLoading={false}
        isPolling={false}
      />,
    );

    expect(
      within(container).getByTestId('details-card-header').textContent,
    ).toContain('Resource');
  });

  it('renders custom content section when provided', () => {
    render(
      <DetailsCard<TestData>
        icon={MoreVertical}
        title="Resource"
        isLoading={false}
        isPolling={false}
        renderCustomContent={() => (
          <div data-testid="custom-content">Custom</div>
        )}
      />,
    );

    expect(screen.getByTestId('custom-content').textContent).toContain(
      'Custom',
    );
  });

  it('renders body section only when tabs exist', () => {
    const { rerender } = render(
      <DetailsCard<TestData>
        icon={MoreVertical}
        title="Resource"
        isLoading={false}
        isPolling={false}
      />,
    );

    expect(screen.queryByTestId('details-card-body')).toBeNull();

    rerender(
      <DetailsCard<TestData>
        icon={MoreVertical}
        title="Resource"
        isLoading={false}
        tabs={[
          { key: 'general', label: 'General', component: <div>Body</div> },
        ]}
      />,
    );

    expect(screen.getByTestId('details-card-body').textContent).toContain(
      'tabs:1',
    );
  });
});
