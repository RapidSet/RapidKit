import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ReactNode } from 'react';
import { RapidKitAccessProvider } from '@lib/access-provider';
import { BaseModal } from './BaseModal';

let canView = true;

const canAccess = vi.fn(
  (
    _: { action: string; subject: string; mode?: 'view' | 'action' },
    mode: 'view' | 'action',
  ) => (mode === 'view' ? canView : true),
);

vi.mock('@ui/dialog', () => ({
  Dialog: ({
    open,
    onOpenChange,
    children,
  }: {
    open: boolean;
    onOpenChange?: (open: boolean) => void;
    children: ReactNode;
  }) =>
    open ? (
      <div data-testid="dialog-root">
        <button type="button" onClick={() => onOpenChange?.(false)}>
          Mock Close
        </button>
        {children}
      </div>
    ) : null,
  DialogContent: ({ children }: { children: ReactNode }) => (
    <div data-testid="dialog-content">{children}</div>
  ),
  DialogClose: ({ children }: { children: ReactNode }) => <>{children}</>,
  DialogPortal: ({ children }: { children: ReactNode }) => <>{children}</>,
  DialogOverlay: ({ children }: { children: ReactNode }) => <>{children}</>,
  DialogTrigger: ({ children }: { children: ReactNode }) => <>{children}</>,
  DialogHeader: ({ children }: { children: ReactNode }) => (
    <div data-testid="dialog-header">{children}</div>
  ),
  DialogTitle: ({ children }: { children: ReactNode }) => <h2>{children}</h2>,
  DialogDescription: ({ children }: { children: ReactNode }) => (
    <p>{children}</p>
  ),
  DialogFooter: ({ children }: { children: ReactNode }) => (
    <div data-testid="dialog-footer">{children}</div>
  ),
}));

vi.mock('@components/Button', () => ({
  Button: ({
    label,
    children,
    onClick,
    disabled,
    'aria-label': ariaLabel,
  }: {
    label?: string;
    children?: ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    'aria-label'?: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {label ?? children}
    </button>
  ),
}));

vi.mock('@components/Button/styles', () => ({
  ButtonVariant: {
    Primary: 'primary',
    Outlined: 'outlined',
    Default: 'default',
  },
}));

afterEach(() => {
  cleanup();
});

describe('BaseModal', () => {
  beforeEach(() => {
    canView = true;
    canAccess.mockClear();
  });

  it('renders title, description and content when open', () => {
    render(
      <BaseModal
        isOpen
        onClose={vi.fn()}
        title="Edit Resource"
        description="Update fields"
      >
        <div>Modal body content</div>
      </BaseModal>,
    );

    expect(screen.getByTestId('dialog-root')).toBeTruthy();
    expect(screen.getByText('Edit Resource')).toBeTruthy();
    expect(screen.getByText('Update fields')).toBeTruthy();
    expect(screen.getByText('Modal body content')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Save' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeTruthy();
  });

  it('calls onSave when Save is clicked', () => {
    const onSave = vi.fn();

    render(
      <BaseModal isOpen onClose={vi.fn()} onSave={onSave}>
        <div>Content</div>
      </BaseModal>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(onSave).toHaveBeenCalledTimes(1);
  });

  it('uses onCancel when provided, otherwise falls back to onClose', () => {
    const onCancel = vi.fn();
    const onClose = vi.fn();

    const { rerender } = render(
      <BaseModal isOpen onClose={onClose} onCancel={onCancel}>
        <div>Content</div>
      </BaseModal>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(0);

    rerender(
      <BaseModal isOpen onClose={onClose}>
        <div>Content</div>
      </BaseModal>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when dialog open state changes to false', () => {
    const onClose = vi.fn();

    render(
      <BaseModal isOpen onClose={onClose}>
        <div>Content</div>
      </BaseModal>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Mock Close' }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();

    render(
      <BaseModal isOpen onClose={onClose}>
        <div>Content</div>
      </BaseModal>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Close modal' }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('disables Cancel when loading and disables Save when saveDisabled is true', () => {
    render(
      <BaseModal isOpen onClose={vi.fn()} isLoading saveDisabled>
        <div>Content</div>
      </BaseModal>,
    );

    expect(
      screen.getByRole('button', { name: 'Cancel' }).hasAttribute('disabled'),
    ).toBe(true);
    expect(
      screen.getByRole('button', { name: 'Save' }).hasAttribute('disabled'),
    ).toBe(true);
  });

  it('keeps modal open when preventOutsideClose is true', () => {
    const onClose = vi.fn();

    render(
      <BaseModal isOpen onClose={onClose} preventOutsideClose>
        <div>Content</div>
      </BaseModal>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Mock Close' }));

    expect(onClose).toHaveBeenCalledTimes(0);
  });

  it('returns null when view access is denied', () => {
    canView = false;

    const { container } = render(
      <BaseModal
        isOpen
        onClose={vi.fn()}
        access={{ rules: [{ action: 'read', subject: 'modal' }] }}
        canAccess={canAccess}
      >
        <div>Hidden modal</div>
      </BaseModal>,
    );

    expect(container.firstChild).toBeNull();
    expect(canAccess).toHaveBeenCalledWith(
      { action: 'read', subject: 'modal' },
      'view',
    );
  });

  it('inherits canAccess from RapidKitAccessProvider when prop is omitted', () => {
    const { container } = render(
      <RapidKitAccessProvider canAccess={() => false}>
        <BaseModal
          isOpen
          onClose={vi.fn()}
          access={{ rules: [{ action: 'read', subject: 'modal' }] }}
        >
          <div>Hidden by provider</div>
        </BaseModal>
      </RapidKitAccessProvider>,
    );

    expect(container.firstChild).toBeNull();
  });

  it('prefers explicit canAccess over RapidKitAccessProvider value', () => {
    render(
      <RapidKitAccessProvider canAccess={() => false}>
        <BaseModal
          isOpen
          onClose={vi.fn()}
          access={{ rules: [{ action: 'read', subject: 'modal' }] }}
          canAccess={() => true}
        >
          <div>Visible by override</div>
        </BaseModal>
      </RapidKitAccessProvider>,
    );

    expect(screen.getByText('Visible by override')).toBeTruthy();
  });
});
