import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ReactNode } from 'react';
import { RapidKitAccessProvider } from '@lib/access-provider';
import { DropDown } from './DropDown';

let selectOnValueChange: ((value: string) => void) | undefined;
let selectOnOpenChange: ((open: boolean) => void) | undefined;
let canView = true;
let canEdit = true;

const canAccess = vi.fn(
  (
    _: { action: string; subject: string; mode?: 'view' | 'edit' },
    mode: 'view' | 'edit',
  ) => (mode === 'view' ? canView : canEdit),
);

vi.mock('@ui/select', () => ({
  Select: ({
    children,
    onValueChange,
    onOpenChange,
    disabled,
  }: {
    children: ReactNode;
    onValueChange?: (value: string) => void;
    onOpenChange?: (open: boolean) => void;
    disabled?: boolean;
  }) => {
    selectOnValueChange = onValueChange;
    selectOnOpenChange = onOpenChange;
    return (
      <div data-testid="select-root" data-disabled={String(Boolean(disabled))}>
        {children}
      </div>
    );
  },
  SelectTrigger: ({ children }: { children: ReactNode }) => (
    <button type="button">{children}</button>
  ),
  SelectValue: ({
    children,
    placeholder,
  }: {
    children?: ReactNode;
    placeholder?: string;
  }) => <div>{children || <span>{placeholder}</span>}</div>,
  SelectContent: ({ children }: { children: ReactNode }) => (
    <div data-testid="select-content">{children}</div>
  ),
  SelectItem: ({ value, children }: { value: string; children: ReactNode }) => (
    <button type="button" onClick={() => selectOnValueChange?.(value)}>
      {children}
    </button>
  ),
}));

describe('DropDown', () => {
  beforeEach(() => {
    cleanup();
    selectOnValueChange = undefined;
    selectOnOpenChange = undefined;
    canView = true;
    canEdit = true;
    canAccess.mockClear();
  });

  it('renders label, required marker, and helper text', () => {
    render(
      <DropDown
        label="Country"
        required
        helperText="Choose one"
        value=""
        onChange={vi.fn()}
        options={[{ value: 'US', label: 'United States' }]}
      />,
    );

    expect(screen.getByText('Country')).toBeTruthy();
    expect(screen.getByText('*')).toBeTruthy();
    expect(screen.getByText('Choose one')).toBeTruthy();
  });

  it('calls onChange when an option is selected', () => {
    const onChange = vi.fn();

    render(
      <DropDown
        value=""
        onChange={onChange}
        options={[
          { value: 'US', label: 'United States' },
          { value: 'CA', label: 'Canada' },
        ]}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Canada' }));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('CA');
  });

  it('renders selected option label when value is set', () => {
    render(
      <DropDown
        value="US"
        onChange={vi.fn()}
        options={[
          { value: 'US', label: 'United States' },
          { value: 'CA', label: 'Canada' },
        ]}
      />,
    );

    expect(screen.getAllByText('United States').length).toBeGreaterThan(0);
  });

  it('uses custom renderOption for selected and list items', () => {
    render(
      <DropDown
        value="US"
        onChange={vi.fn()}
        options={[
          { value: 'US', label: 'United States' },
          { value: 'CA', label: 'Canada' },
        ]}
        renderOption={(option) => <span>Opt: {option.label}</span>}
      />,
    );

    expect(screen.getAllByText('Opt: United States').length).toBeGreaterThan(0);
    expect(screen.getByText('Opt: Canada')).toBeTruthy();
  });

  it('disables select when disabled prop is true', () => {
    render(
      <DropDown
        value="US"
        onChange={vi.fn()}
        disabled
        options={[{ value: 'US', label: 'United States' }]}
      />,
    );

    expect(
      screen.getByTestId('select-root').getAttribute('data-disabled'),
    ).toBe('true');
  });

  it('renders null when view access is denied', () => {
    canView = false;

    render(
      <DropDown
        value="US"
        onChange={vi.fn()}
        access={{ rules: [{ action: 'read', subject: 'resource' }] }}
        canAccess={canAccess}
        options={[{ value: 'US', label: 'United States' }]}
      />,
    );

    expect(screen.queryByTestId('select-root')).toBeNull();
    expect(canAccess).toHaveBeenCalledWith(
      { action: 'read', subject: 'resource' },
      'view',
    );
  });

  it('disables select when edit access is denied', () => {
    canEdit = false;

    render(
      <DropDown
        value="US"
        onChange={vi.fn()}
        access={{ rules: [{ action: 'write', subject: 'resource' }] }}
        canAccess={canAccess}
        options={[{ value: 'US', label: 'United States' }]}
      />,
    );

    expect(
      screen.getByTestId('select-root').getAttribute('data-disabled'),
    ).toBe('true');

    expect(canAccess).toHaveBeenCalledWith(
      { action: 'write', subject: 'resource' },
      'edit',
    );
  });

  it('renders empty state when options are empty', () => {
    render(<DropDown value="" onChange={vi.fn()} options={[]} />);

    expect(screen.getByText('No options found')).toBeTruthy();
  });

  it('calls onOpenChange when dropdown open state changes', () => {
    const onOpenChange = vi.fn();

    render(
      <DropDown
        value=""
        onChange={vi.fn()}
        onOpenChange={onOpenChange}
        options={[{ value: 'US', label: 'United States' }]}
      />,
    );

    selectOnOpenChange?.(true);

    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it('shows clear control when a value is selected and clears selection when clicked', () => {
    const onChange = vi.fn();

    render(
      <DropDown
        value="US"
        onChange={onChange}
        options={[{ value: 'US', label: 'United States' }]}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Clear selection' }));

    expect(onChange).toHaveBeenCalledWith('');
  });

  it('does not show clear control when there is no selected value', () => {
    render(
      <DropDown
        value=""
        onChange={vi.fn()}
        options={[{ value: 'US', label: 'United States' }]}
      />,
    );

    expect(
      screen.queryByRole('button', { name: 'Clear selection' }),
    ).toBeNull();
  });

  it('inherits canAccess from RapidKitAccessProvider when prop is omitted', () => {
    render(
      <RapidKitAccessProvider canAccess={() => false}>
        <DropDown
          value="US"
          onChange={vi.fn()}
          access={{ rules: [{ action: 'read', subject: 'resource' }] }}
          options={[{ value: 'US', label: 'United States' }]}
        />
      </RapidKitAccessProvider>,
    );

    expect(screen.queryByTestId('select-root')).toBeNull();
  });

  it('prefers explicit canAccess over RapidKitAccessProvider value', () => {
    render(
      <RapidKitAccessProvider canAccess={() => false}>
        <DropDown
          value="US"
          onChange={vi.fn()}
          access={{ rules: [{ action: 'read', subject: 'resource' }] }}
          canAccess={() => true}
          options={[{ value: 'US', label: 'United States' }]}
        />
      </RapidKitAccessProvider>,
    );

    expect(screen.getByTestId('select-root')).toBeTruthy();
  });
});
