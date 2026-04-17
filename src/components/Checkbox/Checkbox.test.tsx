import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Checkbox } from './Checkbox';

let canView = true;
let canEdit = true;

describe('Checkbox', () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    canView = true;
    canEdit = true;
  });

  it('renders label, required marker, and title', () => {
    render(
      <Checkbox
        name="acceptTerms"
        label="Accept Terms"
        required
        title="I agree"
        onCheckChange={vi.fn()}
      />,
    );

    expect(Boolean(screen.getByText('Accept Terms'))).toBe(true);
    expect(Boolean(screen.getByText('*'))).toBe(true);
    expect(Boolean(screen.getByText('I agree'))).toBe(true);
  });

  it('calls onCheckChange with checked value and name', () => {
    const onCheckChange = vi.fn();

    render(<Checkbox name="notify" onCheckChange={onCheckChange} />);

    fireEvent.click(screen.getByRole('checkbox'));

    expect(onCheckChange).toHaveBeenCalledTimes(1);
    expect(onCheckChange).toHaveBeenCalledWith(true, 'notify');
  });

  it('hides checkbox when view access is denied', () => {
    canView = false;

    render(
      <Checkbox
        name="secure"
        accessRequirements={['resource:update']}
        resolveAccess={(_, mode) => (mode === 'view' ? canView : canEdit)}
        onCheckChange={vi.fn()}
      />,
    );

    expect(screen.queryByRole('checkbox')).toBeNull();
  });

  it('disables checkbox when edit access is denied', () => {
    canEdit = false;

    render(
      <Checkbox
        name="secure"
        accessRequirements={['resource:update']}
        resolveAccess={(_, mode) => (mode === 'view' ? canView : canEdit)}
        onCheckChange={vi.fn()}
      />,
    );

    expect((screen.getByRole('checkbox') as HTMLInputElement).disabled).toBe(
      true,
    );
  });

  it('renders error and helper text', () => {
    render(
      <Checkbox
        name="field"
        onCheckChange={vi.fn()}
        error="This field is required"
        helperText="Please review before continuing"
      />,
    );

    expect(Boolean(screen.getByText('This field is required'))).toBe(true);
    expect(Boolean(screen.getByText('Please review before continuing'))).toBe(
      true,
    );
    expect(screen.getByRole('checkbox').className).toContain(
      'border-destructive',
    );
  });
});
