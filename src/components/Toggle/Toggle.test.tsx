import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Toggle } from './Toggle';

let canView = true;
let canEdit = true;

describe('Toggle', () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    canView = true;
    canEdit = true;
  });

  it('renders label, required marker, and title', () => {
    render(
      <Toggle
        name="notifications"
        label="Notifications"
        required
        title="Enable alerts"
      />,
    );

    expect(Boolean(screen.getByText('Notifications'))).toBe(true);
    expect(Boolean(screen.getByText('*'))).toBe(true);
    expect(Boolean(screen.getByText('Enable alerts'))).toBe(true);
  });

  it('calls onToggleChange with checked value and name', () => {
    const onToggleChange = vi.fn();

    render(<Toggle name="status" onToggleChange={onToggleChange} />);

    fireEvent.click(screen.getByRole('switch'));

    expect(onToggleChange).toHaveBeenCalledTimes(1);
    expect(onToggleChange).toHaveBeenCalledWith(true, 'status');
  });

  it('hides toggle when view access is denied', () => {
    canView = false;

    render(
      <Toggle
        name="secure"
        accessRequirements={['feature.toggle.read']}
        resolveAccess={(_, mode) => (mode === 'view' ? canView : canEdit)}
      />,
    );

    expect(screen.queryByRole('switch')).toBeNull();
  });

  it('disables toggle when edit access is denied', () => {
    canEdit = false;

    render(
      <Toggle
        name="secure"
        accessRequirements={['feature.toggle.write']}
        resolveAccess={(_, mode) => (mode === 'view' ? canView : canEdit)}
      />,
    );

    expect((screen.getByRole('switch') as HTMLButtonElement).disabled).toBe(
      true,
    );
  });

  it('renders error and helper text', () => {
    render(
      <Toggle
        name="field"
        error="You cannot enable this setting"
        helperText="Requires additional access"
      />,
    );

    expect(Boolean(screen.getByText('You cannot enable this setting'))).toBe(
      true,
    );
    expect(Boolean(screen.getByText('Requires additional access'))).toBe(true);
    expect(screen.getByRole('switch').className).toContain(
      'border-destructive',
    );
  });
});
