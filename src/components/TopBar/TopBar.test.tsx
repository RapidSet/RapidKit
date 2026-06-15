import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Bell, Zap } from 'lucide-react';
import { TopBar } from './TopBar';

describe('TopBar', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders title and subtitle', () => {
    render(<TopBar title="Good evening, Tarik" subtitle="Welcome back" />);

    expect(screen.getByText('Good evening, Tarik')).toBeTruthy();
    expect(screen.getByText('Welcome back')).toBeTruthy();
  });

  it('fires quickAction onSelect when clicked', () => {
    const onSelect = vi.fn();

    render(
      <TopBar quickAction={{ label: 'Quick search', icon: Zap, onSelect }} />,
    );

    fireEvent.click(screen.getByRole('button', { name: /quick search/i }));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('renders trailing actions with their labels as accessible names', () => {
    const onSelect = vi.fn();

    render(
      <TopBar
        trailingActions={[
          { key: 'notif', label: 'Notifications', icon: Bell, onSelect },
        ]}
      />,
    );

    const button = screen.getByRole('button', { name: 'Notifications' });
    fireEvent.click(button);
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('hides actions whose access view check fails', () => {
    render(
      <TopBar
        trailingActions={[
          {
            key: 'gated',
            label: 'Gated',
            icon: Bell,
            access: { rules: [{ action: 'read', subject: 'gated' }] },
          },
        ]}
        canAccess={() => false}
      />,
    );

    expect(screen.queryByRole('button', { name: 'Gated' })).toBeNull();
  });

  it('renders user avatar with computed initials when no avatarUrl is provided', () => {
    render(<TopBar user={{ name: 'Alex Doe' }} />);

    expect(screen.getByRole('button', { name: /alex doe/i })).toBeTruthy();
    expect(screen.getByText('AD')).toBeTruthy();
  });

  it('returns null when view access is denied', () => {
    const { container } = render(
      <TopBar
        title="Hidden"
        access={{ rules: [{ action: 'read', subject: 'topbar' }] }}
        canAccess={() => false}
      />,
    );

    expect(container.firstChild).toBeNull();
  });
});
