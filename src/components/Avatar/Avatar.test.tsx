import { createRef } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { RapidKitAccessProvider } from '@lib/access-provider';
import { Avatar } from './Avatar';

let canView = true;

const canAccess = vi.fn(
  (_: { action: string; subject: string; mode?: 'view' }, mode: 'view') =>
    mode === 'view' ? canView : false,
);

describe('Avatar', () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    canView = true;
    canAccess.mockClear();
  });

  it('renders derived fallback when image is unavailable', () => {
    render(<Avatar src="https://example.com/avatar.png" alt="Rapid Kit" />);

    expect(screen.getByText('RK')).toBeTruthy();
  });

  it('renders explicit fallback content', () => {
    render(<Avatar fallback="RK" alt="Rapid Kit" />);

    expect(screen.getByText('RK')).toBeTruthy();
  });

  it('derives initials fallback from alt text when fallback is not provided', () => {
    render(<Avatar alt="Rapid Kit" />);

    expect(screen.getByText('RK')).toBeTruthy();
  });

  it('forwards ref to avatar root element', () => {
    const ref = createRef<HTMLSpanElement>();

    render(<Avatar ref={ref} data-testid="avatar-root" />);

    expect(ref.current).toBe(screen.getByTestId('avatar-root'));
  });

  it('applies configured size class', () => {
    render(<Avatar size="lg" data-testid="avatar-root" />);

    expect(screen.getByTestId('avatar-root').className).toContain('h-12');
  });

  it('hides avatar when view access is denied', () => {
    canView = false;

    render(
      <Avatar
        alt="Restricted"
        access={{ rules: [{ action: 'read', subject: 'profile' }] }}
        canAccess={canAccess}
      />,
    );

    expect(screen.queryByText('R')).toBeNull();
    expect(canAccess).toHaveBeenCalledWith(
      { action: 'read', subject: 'profile' },
      'view',
    );
  });

  it('remains visible for non-view rules', () => {
    render(
      <Avatar
        alt="Editable"
        access={{ rules: [{ action: 'write', subject: 'profile' }] }}
        canAccess={canAccess}
      />,
    );

    expect(screen.getByText('E')).toBeTruthy();
    expect(canAccess).not.toHaveBeenCalled();
  });

  it('inherits canAccess from RapidKitAccessProvider when prop is omitted', () => {
    const { container } = render(
      <RapidKitAccessProvider canAccess={() => false}>
        <Avatar
          alt="Provider Restricted"
          access={{ rules: [{ action: 'read', subject: 'profile' }] }}
        />
      </RapidKitAccessProvider>,
    );

    expect(container.firstChild).toBeNull();
  });

  it('prefers explicit canAccess over RapidKitAccessProvider value', () => {
    render(
      <RapidKitAccessProvider canAccess={() => false}>
        <Avatar
          alt="Provider Override"
          access={{ rules: [{ action: 'read', subject: 'profile' }] }}
          canAccess={() => true}
        />
      </RapidKitAccessProvider>,
    );

    expect(screen.getByText('PO')).toBeTruthy();
  });
});
