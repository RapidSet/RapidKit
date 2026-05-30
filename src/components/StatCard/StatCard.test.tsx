import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { Users } from 'lucide-react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { RapidKitAccessProvider } from '@lib/access-provider';
import { StatCard } from './StatCard';

let allowsRead = true;
let allowsWrite = true;

const canAccess = vi.fn(
  (
    _: { action: string; subject: string; mode?: 'view' | 'edit' },
    mode: 'view' | 'edit',
  ) => (mode === 'view' ? allowsRead : allowsWrite),
);

describe('StatCard', () => {
  beforeEach(() => {
    allowsRead = true;
    allowsWrite = true;
    canAccess.mockClear();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders label and value', () => {
    render(<StatCard label="Active users" value="24,318" />);

    expect(screen.getByText('Active users')).toBeTruthy();
    expect(screen.getByText('24,318')).toBeTruthy();
  });

  it('renders icon when provided', () => {
    const { container } = render(
      <StatCard label="Active users" value="24,318" icon={Users} />,
    );

    expect(container.querySelector('svg')).toBeTruthy();
  });

  it('renders delta and applies upward trend styling', () => {
    render(
      <StatCard label="Revenue" value="$84,210" delta="+8.1%" trend="up" />,
    );

    const chip = screen.getByText('+8.1%').closest('div');
    expect(chip).toBeTruthy();
    expect(chip?.className).toContain('text-emerald-700');
  });

  it('applies downward trend styling when trend is down', () => {
    render(
      <StatCard label="Conversion" value="3.42%" delta="-0.6%" trend="down" />,
    );

    const chip = screen.getByText('-0.6%').closest('div');
    expect(chip?.className).toContain('text-rose-700');
  });

  it('renders description text when provided', () => {
    render(
      <StatCard label="Sessions" value="109,884" description="vs prior week" />,
    );

    expect(screen.getByText('vs prior week')).toBeTruthy();
  });

  it('renders a non-interactive container by default', () => {
    render(<StatCard label="Sessions" value="109,884" />);

    expect(screen.queryByRole('button')).toBeNull();
  });

  it('renders as a button and calls onClick when interactive', () => {
    const onClick = vi.fn();
    render(<StatCard label="Sessions" value="109,884" onClick={onClick} />);

    const button = screen.getByRole('button', { name: 'Sessions' });
    fireEvent.click(button);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('uses ariaLabel override when provided', () => {
    render(
      <StatCard
        label="Sessions"
        value="109,884"
        ariaLabel="View session details"
        onClick={() => {}}
      />,
    );

    expect(
      screen.getByRole('button', { name: 'View session details' }),
    ).toBeTruthy();
  });

  it('hides the card when read access is denied', () => {
    allowsRead = false;
    const { container } = render(
      <StatCard
        label="Restricted"
        value="--"
        access={{ rules: [{ action: 'read', subject: 'stat-card' }] }}
        canAccess={canAccess}
      />,
    );

    expect(container.firstChild).toBeNull();
    expect(canAccess).toHaveBeenCalledWith(
      { action: 'read', subject: 'stat-card' },
      'view',
    );
  });

  it('renders as non-interactive when edit access is denied', () => {
    allowsRead = true;
    allowsWrite = false;
    const onClick = vi.fn();

    render(
      <StatCard
        label="Locked"
        value="42"
        onClick={onClick}
        access={{ rules: [{ action: 'write', subject: 'stat-card' }] }}
        canAccess={canAccess}
      />,
    );

    expect(screen.queryByRole('button')).toBeNull();
    expect(canAccess).toHaveBeenCalledWith(
      { action: 'write', subject: 'stat-card' },
      'edit',
    );
  });

  it('inherits canAccess from RapidKitAccessProvider when prop is omitted', () => {
    const { container } = render(
      <RapidKitAccessProvider canAccess={() => false}>
        <StatCard
          label="provider hidden"
          value="--"
          access={{ rules: [{ action: 'read', subject: 'stat-card' }] }}
        />
      </RapidKitAccessProvider>,
    );

    expect(container.firstChild).toBeNull();
  });
});
