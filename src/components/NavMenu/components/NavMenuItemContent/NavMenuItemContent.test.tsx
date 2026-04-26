import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { Home, User } from 'lucide-react';
import { NavMenuItemContent } from './NavMenuItemContent';

describe('NavMenuItemContent', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders compact label-only content when description is missing', () => {
    render(
      <NavMenuItemContent item={{ label: 'Profile', href: '/profile' }} />,
    );

    expect(screen.getByText('Profile')).toBeTruthy();
    expect(screen.queryByText('External')).toBeNull();
    expect(screen.queryByText('Soon')).toBeNull();
  });

  it('renders description content when description is provided', () => {
    render(
      <NavMenuItemContent
        item={{
          label: 'Overview',
          href: '/overview',
          description: 'Live system health, SLAs, and key KPIs.',
        }}
      />,
    );

    expect(screen.getByText('Overview')).toBeTruthy();
    const label = screen.getByText('Overview');
    const description = screen.getByText(
      'Live system health, SLAs, and key KPIs.',
    );

    expect(label).toBeTruthy();
    expect(label.className).toContain('group-hover/item:text-primary');
    expect(description).toBeTruthy();
    expect(description.className).toContain('group-hover/item:text-primary');
  });

  it('applies description className override', () => {
    render(
      <NavMenuItemContent
        item={{
          label: 'Incidents',
          href: '/incidents',
          description: 'Active incidents and escalation history.',
        }}
        descriptionClassName="custom-description"
      />,
    );

    const description = screen.getByText(
      'Active incidents and escalation history.',
    );

    expect(description.className).toContain('custom-description');
  });

  it('renders External badge for external items', () => {
    render(
      <NavMenuItemContent
        item={{
          label: 'Documentation',
          href: 'https://rapidset.github.io/RapidKit/components/',
          external: true,
        }}
      />,
    );

    expect(screen.getByText('Documentation')).toBeTruthy();
    const badge = screen.getByText('External');

    expect(badge).toBeTruthy();
    expect(badge.className).toContain('group-hover/item:text-primary');
  });

  it('renders Soon badge for disabled items', () => {
    render(
      <NavMenuItemContent
        item={{ label: 'Billing', href: '/billing', disabled: true }}
      />,
    );

    expect(screen.getByText('Billing')).toBeTruthy();
    expect(screen.getByText('Soon')).toBeTruthy();
  });

  it('renders icon when provided for descriptive items', () => {
    const { container } = render(
      <NavMenuItemContent
        item={{
          label: 'Overview',
          href: '/overview',
          description: 'Live system health, SLAs, and key KPIs.',
          icon: Home,
        }}
      />,
    );

    expect(container.querySelector('svg')).toBeTruthy();
  });

  it('renders icon when provided for compact items', () => {
    const { container } = render(
      <NavMenuItemContent
        item={{
          label: 'Profile',
          href: '/profile',
          icon: User,
        }}
      />,
    );

    expect(container.querySelector('svg')).toBeTruthy();
  });
});
