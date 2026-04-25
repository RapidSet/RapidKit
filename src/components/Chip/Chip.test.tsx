import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { Circle } from 'lucide-react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { RapidKitAccessProvider } from '@lib/access-provider';
import { Chip } from './Chip';

let allowsRead = true;
let allowsWrite = true;

const canAccess = vi.fn(
  (
    _: { action: string; subject: string; mode?: 'view' | 'edit' },
    mode: 'view' | 'edit',
  ) => (mode === 'view' ? allowsRead : allowsWrite),
);

describe('Chip', () => {
  beforeEach(() => {
    allowsRead = true;
    allowsWrite = true;
    canAccess.mockClear();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders chip label content', () => {
    render(<Chip label="active" />);

    expect(screen.getByText('active')).toBeTruthy();
  });

  it('applies size and variant classes', () => {
    render(
      <Chip
        label="status"
        size="lg"
        variant="outline"
        data-testid="chip-root"
      />,
    );

    const chip = screen.getByTestId('chip-root');
    expect(chip.className).toContain('px-3.5');
    expect(chip.className).toContain('text-base');
    expect(chip.className).toContain('bg-background');
    expect(chip.className).toContain('border-border');
  });

  it('uses roomier default spacing for label-only chips', () => {
    render(<Chip label="status" data-testid="chip-root" />);

    const chip = screen.getByTestId('chip-root');
    expect(chip.className).toContain('gap-2');
    expect(chip.className).toContain('px-2.5');
    expect(chip.className).toContain('py-1.5');
    expect(chip.className).toContain('leading-none');
  });

  it('renders icon and pulse class when enabled', () => {
    render(
      <Chip label="syncing" icon={Circle} pulse data-testid="chip-root" />,
    );

    const chip = screen.getByTestId('chip-root');
    const icon = chip.querySelector('svg');
    expect(icon).toBeTruthy();
    const iconClassName =
      icon?.getAttribute('class') ??
      (typeof icon?.className === 'string' ? icon.className : '');
    expect(iconClassName).toContain('h-[1em]');
    expect(
      chip.querySelector(String.raw`.motion-safe\:animate-pulse`),
    ).toBeTruthy();
  });

  it('renders remove button and calls onRemove', () => {
    const onRemove = vi.fn();

    render(<Chip label="selected" onRemove={onRemove} />);

    fireEvent.click(screen.getByRole('button', { name: 'Remove selected' }));

    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('stops click propagation from remove action', () => {
    const onParentClick = vi.fn();
    const onRemove = vi.fn();

    render(
      <div data-testid="parent" onClick={onParentClick}>
        <Chip label="selected" onRemove={onRemove} />
      </div>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Remove selected' }));

    expect(onRemove).toHaveBeenCalledTimes(1);
    expect(onParentClick).not.toHaveBeenCalled();
  });

  it('does not render remove button when onRemove is omitted', () => {
    render(<Chip label="readonly" />);

    expect(screen.queryByRole('button')).toBeNull();
  });

  it('hides chip when read access is denied', () => {
    allowsRead = false;

    const { container } = render(
      <Chip
        label="restricted"
        access={{ rules: [{ action: 'read', subject: 'chip' }] }}
        canAccess={canAccess}
      />,
    );

    expect(container.firstChild).toBeNull();
    expect(canAccess).toHaveBeenCalledWith(
      { action: 'read', subject: 'chip' },
      'view',
    );
  });

  it('disables remove action when edit access is denied', () => {
    allowsRead = true;
    allowsWrite = false;
    const onRemove = vi.fn();

    render(
      <Chip
        label="locked"
        onRemove={onRemove}
        access={{ rules: [{ action: 'write', subject: 'chip' }] }}
        canAccess={canAccess}
      />,
    );

    const removeButton = screen.getByRole('button', { name: 'Remove locked' });
    expect((removeButton as HTMLButtonElement).disabled).toBe(true);

    fireEvent.click(removeButton);
    expect(onRemove).not.toHaveBeenCalled();
    expect(canAccess).toHaveBeenCalledWith(
      { action: 'write', subject: 'chip' },
      'edit',
    );
  });

  it('keeps chip visible when rules exist but resolver is missing', () => {
    render(
      <Chip
        label="visible"
        access={{ rules: [{ action: 'read', subject: 'chip' }] }}
      />,
    );

    expect(screen.getByText('visible')).toBeTruthy();
  });

  it('inherits canAccess from RapidKitAccessProvider when prop is omitted', () => {
    const { container } = render(
      <RapidKitAccessProvider canAccess={() => false}>
        <Chip
          label="provider hidden"
          access={{ rules: [{ action: 'read', subject: 'chip' }] }}
        />
      </RapidKitAccessProvider>,
    );

    expect(container.firstChild).toBeNull();
  });

  it('prefers explicit canAccess over RapidKitAccessProvider value', () => {
    render(
      <RapidKitAccessProvider canAccess={() => false}>
        <Chip
          label="provider override"
          access={{ rules: [{ action: 'read', subject: 'chip' }] }}
          canAccess={() => true}
        />
      </RapidKitAccessProvider>,
    );

    expect(screen.getByText('provider override')).toBeTruthy();
  });
});
