import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { ReactNode } from 'react';
import { Home } from 'lucide-react';
import { RapidKitAccessProvider } from '@lib/access-provider';
import { NavMenu } from './NavMenu';

vi.mock('@ui/navigation-menu', () => ({
  NavigationMenu: ({
    children,
    className,
    viewportClassName,
    value,
    onValueChange,
    delayDuration,
    skipDelayDuration,
    ...props
  }: {
    children: ReactNode;
    className?: string;
    viewportClassName?: string;
    value?: string;
    onValueChange?: (value: string) => void;
    delayDuration?: number;
    skipDelayDuration?: number;
  }) => {
    void viewportClassName;
    void value;
    void onValueChange;
    void delayDuration;
    void skipDelayDuration;

    return (
      <nav className={className} {...props}>
        {children}
      </nav>
    );
  },
  NavigationMenuList: ({
    children,
    className,
  }: {
    children: ReactNode;
    className?: string;
  }) => <ul className={className}>{children}</ul>,
  NavigationMenuItem: ({ children }: { children: ReactNode }) => (
    <li>{children}</li>
  ),
  NavigationMenuTrigger: ({
    children,
    className,
  }: {
    children: ReactNode;
    className?: string;
  }) => (
    <button type="button" className={className}>
      {children}
    </button>
  ),
  NavigationMenuContent: ({
    children,
    className,
  }: {
    children: ReactNode;
    className?: string;
  }) => <div className={className}>{children}</div>,
  NavigationMenuLink: ({
    children,
    asChild,
  }: {
    children: ReactNode;
    asChild?: boolean;
  }) => (asChild ? children : <a href="#mock-link">{children}</a>),
}));

describe('NavMenu', () => {
  let canView = true;
  let canEdit = true;

  const canAccess = vi.fn(
    (
      _: { action: string; subject: string; mode?: 'view' | 'edit' },
      mode: 'view' | 'edit',
    ) => (mode === 'view' ? canView : canEdit),
  );

  afterEach(() => {
    cleanup();
    canView = true;
    canEdit = true;
    canAccess.mockClear();
  });

  const sections = [
    {
      id: 'platform',
      label: 'Platform',
      items: [
        {
          label: 'Overview',
          href: '/overview',
          description: 'System status and high-level metrics.',
        },
        {
          label: 'Alerts',
          href: '/alerts',
          external: true,
        },
      ],
    },
  ];

  it('renders section trigger and links', () => {
    render(<NavMenu sections={sections} />);

    expect(screen.getByText('Platform')).toBeTruthy();
    expect(screen.getByText('Overview')).toBeTruthy();
    expect(screen.getByText('Alerts')).toBeTruthy();
  });

  it('sets external link target and rel defaults', () => {
    render(<NavMenu sections={sections} />);

    const externalLink = screen.getByRole('link', { name: /alerts/i });
    expect(externalLink.getAttribute('target')).toBe('_blank');
    expect(externalLink.getAttribute('rel')).toBe('noopener noreferrer');
    expect(screen.getByText('External')).toBeTruthy();
  });

  it('renders disabled items as non-link content', () => {
    render(
      <NavMenu
        sections={[
          {
            label: 'Docs',
            items: [{ label: 'Private', href: '/private', disabled: true }],
          },
        ]}
      />,
    );

    expect(screen.queryByRole('link', { name: 'Private' })).toBeNull();
    const disabledLabel = screen.getByText('Private');
    expect(disabledLabel.closest('[aria-disabled="true"]')).toBeTruthy();
    expect(screen.getByText('Soon')).toBeTruthy();
  });

  it('uses custom item renderer when provided', () => {
    render(
      <NavMenu
        sections={sections}
        renderItem={(item) => <span>Item: {item.label}</span>}
      />,
    );

    expect(screen.getByText('Item: Overview')).toBeTruthy();
    expect(screen.getByText('Item: Alerts')).toBeTruthy();
  });

  it('renders compact dropdown layout when a section has no descriptions', () => {
    const { container } = render(
      <NavMenu
        sections={[
          {
            label: 'Account',
            items: [
              { label: 'Profile', href: '/profile' },
              { label: 'API Keys', href: '/api-keys' },
            ],
          },
        ]}
      />,
    );

    const content = Array.from(container.querySelectorAll('div')).find((el) =>
      el.className.includes('md:min-w-[14rem]'),
    );
    const list = Array.from(container.querySelectorAll('ul')).find((el) =>
      el.className.includes('min-w-[14rem]'),
    );

    expect(content).toBeTruthy();
    expect(list).toBeTruthy();
    expect(screen.getByText('Profile')).toBeTruthy();
    expect(screen.getByText('API Keys')).toBeTruthy();
  });

  it('applies root and list className props', () => {
    const { container } = render(
      <NavMenu
        sections={sections}
        className="custom-root"
        listClassName="custom-list"
      />,
    );

    expect(container.querySelector('.custom-root')).toBeTruthy();
    expect(container.querySelector('.custom-list')).toBeTruthy();
  });

  it('renders icons from section items in default content', () => {
    const { container } = render(
      <NavMenu
        sections={[
          {
            label: 'Platform',
            items: [
              {
                label: 'Overview',
                href: '/overview',
                description: 'System status and high-level metrics.',
                icon: Home,
              },
            ],
          },
        ]}
      />,
    );

    expect(container.querySelector('svg')).toBeTruthy();
  });

  it('renders null when view access is denied', () => {
    canView = false;

    const { container } = render(
      <NavMenu
        sections={sections}
        access={{ rules: [{ action: 'read', subject: 'navigation' }] }}
        canAccess={canAccess}
      />,
    );

    expect(container.firstChild).toBeNull();
    expect(canAccess).toHaveBeenCalledWith(
      { action: 'read', subject: 'navigation' },
      'view',
    );
  });

  it('disables all items when edit access is denied', () => {
    canEdit = false;

    render(
      <NavMenu
        sections={sections}
        access={{ rules: [{ action: 'write', subject: 'navigation' }] }}
        canAccess={canAccess}
      />,
    );

    expect(screen.queryByRole('link', { name: /overview/i })).toBeNull();
    expect(screen.queryByRole('link', { name: /alerts/i })).toBeNull();
    expect(document.querySelectorAll('[aria-disabled="true"]').length).toBe(2);
    expect(canAccess).toHaveBeenCalledWith(
      { action: 'write', subject: 'navigation' },
      'edit',
    );
  });

  it('inherits canAccess from RapidKitAccessProvider when prop is omitted', () => {
    const { container } = render(
      <RapidKitAccessProvider canAccess={() => false}>
        <NavMenu
          sections={sections}
          access={{ rules: [{ action: 'read', subject: 'navigation' }] }}
        />
      </RapidKitAccessProvider>,
    );

    expect(container.firstChild).toBeNull();
  });

  it('prefers explicit canAccess over RapidKitAccessProvider value', () => {
    render(
      <RapidKitAccessProvider canAccess={() => false}>
        <NavMenu
          sections={sections}
          access={{ rules: [{ action: 'read', subject: 'navigation' }] }}
          canAccess={() => true}
        />
      </RapidKitAccessProvider>,
    );

    expect(screen.getByText('Platform')).toBeTruthy();
  });
});
