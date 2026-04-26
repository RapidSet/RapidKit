import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { NavMenuItemBadge } from './NavMenuItemBadge';

describe('NavMenuItemBadge', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders Soon badge for disabled items', () => {
    render(
      <NavMenuItemBadge
        item={{ label: 'Billing', href: '/billing', disabled: true }}
      />,
    );

    expect(screen.getByText('Soon')).toBeTruthy();
  });

  it('renders External badge for external items', () => {
    render(
      <NavMenuItemBadge
        item={{
          label: 'Documentation',
          href: 'https://rapidset.github.io/RapidKit/components/',
          external: true,
        }}
      />,
    );

    expect(screen.getByText('External')).toBeTruthy();
  });

  it('renders nothing for regular internal items', () => {
    const { container } = render(
      <NavMenuItemBadge item={{ label: 'Overview', href: '/overview' }} />,
    );

    expect(container.firstChild).toBeNull();
  });
});
