import { createRef } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { Avatar } from './Avatar';

describe('Avatar', () => {
  afterEach(() => {
    cleanup();
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
    render(
      <Avatar
        alt="Restricted"
        accessRequirements={['profile.read']}
        resolveAccess={() => false}
      />,
    );

    expect(screen.queryByText('R')).toBeNull();
  });

  it('remains visible for write-only requirements', () => {
    render(
      <Avatar
        alt="Editable"
        accessRequirements={['profile.write']}
        resolveAccess={() => false}
      />,
    );

    expect(screen.getByText('E')).toBeTruthy();
  });
});
