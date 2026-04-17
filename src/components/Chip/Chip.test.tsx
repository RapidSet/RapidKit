import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { Circle } from 'lucide-react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Chip } from './Chip';

let allowsRead = true;
let allowsWrite = true;

const resolveAccess = vi.fn((_: string, mode: 'view' | 'edit') =>
  mode === 'view' ? allowsRead : allowsWrite,
);

describe('Chip', () => {
  afterEach(() => {
    cleanup();
    allowsRead = true;
    allowsWrite = true;
    resolveAccess.mockClear();
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
    expect(chip.className).toContain('px-3');
    expect(chip.className).toContain('text-base');
    expect(chip.className).toContain('bg-background');
    expect(chip.className).toContain('border-border');
  });

  it('renders icon and pulse class when enabled', () => {
    render(
      <Chip label="syncing" icon={Circle} pulse data-testid="chip-root" />,
    );

    const chip = screen.getByTestId('chip-root');
    expect(chip.querySelector('svg')).toBeTruthy();
    expect(chip.querySelector('.motion-safe\\:animate-pulse')).toBeTruthy();
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
      <div onClick={onParentClick}>
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
        accessRequirements={['chip.read']}
        resolveAccess={resolveAccess}
      />,
    );

    expect(container.firstChild).toBeNull();
    expect(resolveAccess).toHaveBeenCalledWith('chip.read', 'view');
  });

  it('disables remove action when edit access is denied', () => {
    allowsRead = true;
    allowsWrite = false;
    const onRemove = vi.fn();

    render(
      <Chip
        label="locked"
        onRemove={onRemove}
        accessRequirements={['chip.write']}
        resolveAccess={resolveAccess}
      />,
    );

    const removeButton = screen.getByRole('button', { name: 'Remove locked' });
    expect((removeButton as HTMLButtonElement).disabled).toBe(true);

    fireEvent.click(removeButton);
    expect(onRemove).not.toHaveBeenCalled();
    expect(resolveAccess).toHaveBeenCalledWith('chip.write', 'edit');
  });

  it('keeps chip visible when requirements exist but resolver is missing', () => {
    render(<Chip label="visible" accessRequirements={['chip.read']} />);

    expect(screen.getByText('visible')).toBeTruthy();
  });
});
