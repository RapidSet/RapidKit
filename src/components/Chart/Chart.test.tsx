import { createRef } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { RapidKitAccessProvider } from '@lib/access-provider';
import { Chart } from './Chart';
import { ChartVariant } from './consts';
import type { ChartConfig } from './types';

vi.mock('recharts', async (importOriginal) => {
  const actual = await importOriginal<typeof import('recharts')>();
  const ResponsiveContainerMock = ({
    children,
  }: {
    children: React.ReactNode;
  }) => (
    <div
      data-testid="rk-responsive-container"
      style={{ width: 600, height: 300 }}
    >
      {children}
    </div>
  );
  return {
    ...actual,
    ResponsiveContainer: ResponsiveContainerMock,
  };
});

const SAMPLE_CONFIG: ChartConfig = {
  revenue: { label: 'Revenue', color: 'hsl(var(--primary))' },
  cost: { label: 'Cost', color: 'hsl(var(--destructive))' },
};

const SAMPLE_DATA = [
  { month: 'Jan', revenue: 120, cost: 80 },
  { month: 'Feb', revenue: 200, cost: 110 },
  { month: 'Mar', revenue: 180, cost: 100 },
];

const SAMPLE_SERIES = [{ dataKey: 'revenue' }, { dataKey: 'cost' }] as const;

const PIE_DATA = [
  { segment: 'Web', value: 50 },
  { segment: 'Mobile', value: 30 },
  { segment: 'API', value: 20 },
];

const PIE_CONFIG: ChartConfig = {
  Web: { label: 'Web', color: 'hsl(var(--primary))' },
  Mobile: { label: 'Mobile', color: 'hsl(var(--accent-foreground))' },
  API: { label: 'API', color: 'hsl(var(--destructive))' },
};

describe('Chart', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders a chart container with role img for the line variant', () => {
    render(
      <Chart
        type={ChartVariant.Line}
        data={SAMPLE_DATA}
        config={SAMPLE_CONFIG}
        series={SAMPLE_SERIES}
        xAxisKey="month"
      />,
    );

    const chart = screen.getByRole('img', { name: /line chart/i });
    expect(chart).toBeTruthy();
    expect(chart.getAttribute('data-chart')).toMatch(/^chart-/);
  });

  it('renders the bar variant', () => {
    render(
      <Chart
        type={ChartVariant.Bar}
        data={SAMPLE_DATA}
        config={SAMPLE_CONFIG}
        series={SAMPLE_SERIES}
        xAxisKey="month"
      />,
    );

    expect(screen.getByRole('img', { name: /bar chart/i })).toBeTruthy();
  });

  it('renders the area variant', () => {
    render(
      <Chart
        type={ChartVariant.Area}
        data={SAMPLE_DATA}
        config={SAMPLE_CONFIG}
        series={SAMPLE_SERIES}
        xAxisKey="month"
      />,
    );

    expect(screen.getByRole('img', { name: /area chart/i })).toBeTruthy();
  });

  it('renders the pie variant', () => {
    render(
      <Chart
        type={ChartVariant.Pie}
        data={PIE_DATA}
        config={PIE_CONFIG}
        dataKey="value"
        nameKey="segment"
      />,
    );

    expect(screen.getByRole('img', { name: /pie chart/i })).toBeTruthy();
  });

  it('renders the empty state when data is empty', () => {
    render(
      <Chart
        type={ChartVariant.Line}
        data={[]}
        config={SAMPLE_CONFIG}
        series={SAMPLE_SERIES}
        xAxisKey="month"
      />,
    );

    const empty = screen.getByRole('img', { name: /empty chart/i });
    expect(empty.textContent).toContain('No data to display');
  });

  it('renders a custom empty state node when provided', () => {
    render(
      <Chart
        type={ChartVariant.Line}
        data={[]}
        config={SAMPLE_CONFIG}
        series={SAMPLE_SERIES}
        xAxisKey="month"
        emptyState={<span>Custom empty</span>}
      />,
    );

    expect(screen.getByText('Custom empty')).toBeTruthy();
  });

  it('applies the provided className to the chart container', () => {
    render(
      <Chart
        type={ChartVariant.Line}
        data={SAMPLE_DATA}
        config={SAMPLE_CONFIG}
        series={SAMPLE_SERIES}
        xAxisKey="month"
        className="custom-chart-class"
      />,
    );

    const chart = screen.getByRole('img', { name: /line chart/i });
    expect(chart.className).toContain('custom-chart-class');
  });

  it('forwards refs to the chart container element', () => {
    const ref = createRef<HTMLDivElement>();

    render(
      <Chart
        ref={ref}
        type={ChartVariant.Line}
        data={SAMPLE_DATA}
        config={SAMPLE_CONFIG}
        series={SAMPLE_SERIES}
        xAxisKey="month"
      />,
    );

    expect(ref.current).not.toBeNull();
    expect(ref.current?.getAttribute('role')).toBe('img');
  });

  it('returns null when view access is denied with no resolver match', () => {
    const { container } = render(
      <Chart
        type={ChartVariant.Line}
        data={SAMPLE_DATA}
        config={SAMPLE_CONFIG}
        series={SAMPLE_SERIES}
        xAxisKey="month"
        access={{ rules: [{ action: 'read', subject: 'metrics' }] }}
        canAccess={() => false}
      />,
    );

    expect(container.querySelector('[role="img"]')).toBeNull();
  });

  it('renders when view access is allowed', () => {
    render(
      <Chart
        type={ChartVariant.Line}
        data={SAMPLE_DATA}
        config={SAMPLE_CONFIG}
        series={SAMPLE_SERIES}
        xAxisKey="month"
        access={{ rules: [{ action: 'read', subject: 'metrics' }] }}
        canAccess={() => true}
      />,
    );

    expect(screen.getByRole('img', { name: /line chart/i })).toBeTruthy();
  });

  it('inherits canAccess from RapidKitAccessProvider when prop is omitted', () => {
    const { container } = render(
      <RapidKitAccessProvider canAccess={() => false}>
        <Chart
          type={ChartVariant.Line}
          data={SAMPLE_DATA}
          config={SAMPLE_CONFIG}
          series={SAMPLE_SERIES}
          xAxisKey="month"
          access={{ rules: [{ action: 'read', subject: 'metrics' }] }}
        />
      </RapidKitAccessProvider>,
    );

    expect(container.querySelector('[role="img"]')).toBeNull();
  });

  it('skips hidden series so they are not rendered in the chart payload', () => {
    const { container } = render(
      <Chart
        type={ChartVariant.Bar}
        data={SAMPLE_DATA}
        config={SAMPLE_CONFIG}
        series={[{ dataKey: 'revenue' }, { dataKey: 'cost', hidden: true }]}
        xAxisKey="month"
      />,
    );

    expect(container.querySelector('[role="img"]')).toBeTruthy();
  });
});
