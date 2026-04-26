import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ReactNode } from 'react';
import { RapidKitAccessProvider } from '@lib/access-provider';
import { DatePicker } from './DatePicker';

let canView = true;
let canEdit = true;

const canAccess = vi.fn(
  (
    _: { action: string; subject: string; mode?: 'view' | 'edit' },
    mode: 'view' | 'edit',
  ) => (mode === 'view' ? canView : canEdit),
);

vi.mock('@ui/popover', () => ({
  Popover: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  PopoverTrigger: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  PopoverContent: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock('@ui/button', () => ({
  Button: ({
    id,
    disabled,
    children,
  }: {
    id?: string;
    disabled?: boolean;
    children: ReactNode;
  }) => (
    <button type="button" id={id} disabled={disabled}>
      {children}
    </button>
  ),
}));

vi.mock('@ui/calendar', () => ({
  Calendar: ({
    onSelect,
    disabled,
  }: {
    onSelect?: (date?: Date) => void;
    disabled?: boolean;
  }) => (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onSelect?.(new Date(2024, 0, 15))}
    >
      Pick Mock Date
    </button>
  ),
}));

describe('DatePicker', () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    canView = true;
    canEdit = true;
    canAccess.mockClear();
  });

  it('renders label, required marker and selected date text', () => {
    render(
      <DatePicker
        label="Start Date"
        name="startDate"
        value="2024-01-02"
        required
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByText('Start Date')).toBeTruthy();
    expect(screen.getByText('*')).toBeTruthy();
    expect(screen.getByText('Jan 02, 2024')).toBeTruthy();
  });

  it('shows helper text when provided', () => {
    render(
      <DatePicker
        label="Start Date"
        name="startDate"
        value=""
        helperText="Choose a start date"
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByText('Choose a start date')).toBeTruthy();
  });

  it('shows error and helper text together when both are provided', () => {
    render(
      <DatePicker
        label="Start Date"
        name="startDate"
        value=""
        helperText="Choose a start date"
        error="Date is required"
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByText('Date is required')).toBeTruthy();
    expect(screen.getByText('Choose a start date')).toBeTruthy();
  });

  it('calls onChange with local yyyy-mm-dd value when date is selected', () => {
    const onChange = vi.fn();

    render(
      <DatePicker
        label="Start Date"
        name="startDate"
        value=""
        onChange={onChange}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Pick Mock Date' }));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith({
      target: { name: 'startDate', value: '2024-01-15' },
    });
  });

  it('renders as read-only when user has no edit permission', () => {
    canView = true;
    canEdit = false;

    render(
      <DatePicker
        label="Start Date"
        name="startDate"
        value=""
        access={{ rules: [{ action: 'write', subject: 'resource' }] }}
        canAccess={canAccess}
        onChange={vi.fn()}
      />,
    );

    expect(document.getElementById('startDate')).toHaveProperty(
      'disabled',
      true,
    );
    expect(
      screen.getByRole('button', { name: 'Pick Mock Date' }),
    ).toHaveProperty('disabled', true);
  });

  it('does not render when user has no view permission', () => {
    canView = false;

    const { container } = render(
      <DatePicker
        label="Start Date"
        name="startDate"
        value=""
        access={{ rules: [{ action: 'read', subject: 'resource' }] }}
        canAccess={canAccess}
        onChange={vi.fn()}
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  it('disables picker when disabled prop is true', () => {
    render(
      <DatePicker
        label="Start Date"
        name="startDate"
        value=""
        disabled
        onChange={vi.fn()}
      />,
    );

    expect(document.getElementById('startDate')).toHaveProperty(
      'disabled',
      true,
    );
  });

  it('inherits canAccess from RapidKitAccessProvider when prop is omitted', () => {
    const { container } = render(
      <RapidKitAccessProvider canAccess={() => false}>
        <DatePicker
          label="Start Date"
          name="providerHiddenDate"
          value=""
          access={{ rules: [{ action: 'read', subject: 'resource' }] }}
          onChange={vi.fn()}
        />
      </RapidKitAccessProvider>,
    );

    expect(container.firstChild).toBeNull();
  });

  it('prefers explicit canAccess over RapidKitAccessProvider value', () => {
    render(
      <RapidKitAccessProvider canAccess={() => false}>
        <DatePicker
          label="Provider Override"
          name="providerOverrideDate"
          value="2024-01-02"
          access={{ rules: [{ action: 'read', subject: 'resource' }] }}
          canAccess={() => true}
          onChange={vi.fn()}
        />
      </RapidKitAccessProvider>,
    );

    expect(screen.getByText('Jan 02, 2024')).toBeTruthy();
  });
});
