import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { OnboardingChecklist } from './OnboardingChecklist';

describe('OnboardingChecklist', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders title and items', () => {
    render(
      <OnboardingChecklist
        title="Complete your profile"
        items={[
          { id: 'a', label: 'Add a photo', done: false },
          { id: 'b', label: 'Invite teammates', done: true },
        ]}
      />,
    );

    expect(screen.getByText('Complete your profile')).toBeTruthy();
    expect(screen.getByText('Add a photo')).toBeTruthy();
    expect(screen.getByText('Invite teammates')).toBeTruthy();
  });

  it('computes progress as the percentage of done items', () => {
    render(
      <OnboardingChecklist
        title="Setup"
        items={[
          { id: 'a', label: 'A', done: true },
          { id: 'b', label: 'B', done: true },
          { id: 'c', label: 'C', done: false },
          { id: 'd', label: 'D', done: false },
          { id: 'e', label: 'E', done: false },
        ]}
      />,
    );

    const bar = screen.getByRole('progressbar');
    expect(bar.getAttribute('aria-valuenow')).toBe('40');
  });

  it('fires onSelect when an item is clicked', () => {
    const onSelect = vi.fn();

    render(
      <OnboardingChecklist
        title="Setup"
        items={[{ id: 'a', label: 'Add a photo', done: false, onSelect }]}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /add a photo/i }));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('renders dismiss button and fires onDismiss', () => {
    const onDismiss = vi.fn();

    render(
      <OnboardingChecklist
        title="Setup"
        dismissible
        onDismiss={onDismiss}
        items={[{ id: 'a', label: 'A', done: false }]}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /dismiss/i }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('renders empty state when items is empty', () => {
    render(
      <OnboardingChecklist
        title="Setup"
        items={[]}
        emptyState={<p>All done!</p>}
      />,
    );

    expect(screen.getByText('All done!')).toBeTruthy();
    expect(screen.queryByRole('progressbar')).toBeNull();
  });

  it('returns null when view access is denied', () => {
    const { container } = render(
      <OnboardingChecklist
        title="Hidden"
        items={[]}
        access={{ rules: [{ action: 'read', subject: 'onboarding' }] }}
        canAccess={() => false}
      />,
    );

    expect(container.firstChild).toBeNull();
  });
});
