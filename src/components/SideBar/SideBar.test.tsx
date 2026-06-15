import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Settings } from 'lucide-react';
import { SideBarAccessProvider } from './access-context';
import { SideBar } from './SideBar';

describe('SideBar', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders default child components with brand, menu, and user', () => {
    render(
      <SideBar
        menuItems={[
          {
            key: 'settings',
            label: 'Settings',
            icon: Settings,
            href: '/settings',
          },
        ]}
        user={{ name: 'Alex Doe', email: 'alex@example.com' }}
      />,
    );

    expect(screen.getByText('Settings')).toBeTruthy();
    expect(screen.getByText('Alex Doe')).toBeTruthy();
  });

  it('returns null when view access is denied', () => {
    render(
      <SideBar
        access={{ rules: [{ action: 'read', subject: 'sidebar' }] }}
        canAccess={() => false}
        menuItems={[{ key: 'home', label: 'Home' }]}
      />,
    );

    expect(screen.queryByText('Home')).toBeNull();
  });

  it('disables interactions when edit access is denied', () => {
    const onSelect = vi.fn();

    render(
      <SideBar
        access={{ rules: [{ action: 'write', subject: 'sidebar' }] }}
        canAccess={(_, mode) => mode !== 'edit'}
        menuItems={[{ key: 'billing', label: 'Billing', onSelect }]}
      />,
    );

    const link = screen.getByRole('link', { name: 'Billing' });
    expect(link.getAttribute('aria-disabled')).toBe('true');
  });

  it('renders custom children composition when provided', () => {
    render(
      <SideBar>
        <div>Custom sidebar body</div>
      </SideBar>,
    );

    expect(screen.getByText('Custom sidebar body')).toBeTruthy();
  });

  it('inherits canAccess from SideBarAccessProvider when prop is omitted', () => {
    render(
      <SideBarAccessProvider canAccess={() => false}>
        <SideBar
          access={{ rules: [{ action: 'read', subject: 'sidebar' }] }}
          menuItems={[{ key: 'home', label: 'Home' }]}
        />
      </SideBarAccessProvider>,
    );

    expect(screen.queryByText('Home')).toBeNull();
  });

  it('renders mainContent alongside the sidebar', () => {
    render(
      <SideBar
        menuItems={[{ key: 'home', label: 'Home' }]}
        mainContent={<main data-testid="shell-main">Workspace overview</main>}
      />,
    );

    expect(screen.getByTestId('shell-main').textContent).toBe(
      'Workspace overview',
    );
    expect(screen.getByText('Home')).toBeTruthy();
  });

  it('prefers explicit canAccess prop over provider value', () => {
    render(
      <SideBarAccessProvider canAccess={() => false}>
        <SideBar
          access={{ rules: [{ action: 'read', subject: 'sidebar' }] }}
          canAccess={() => true}
          menuItems={[{ key: 'home', label: 'Home' }]}
        />
      </SideBarAccessProvider>,
    );

    expect(screen.getByText('Home')).toBeTruthy();
  });

  it('renders workspace switcher row when workspace prop is provided', () => {
    render(
      <SideBar
        workspace={{ name: 'Acme Inc', subtitle: 'Workspace' }}
        menuItems={[{ key: 'home', label: 'Home' }]}
      />,
    );

    expect(screen.getByText('Acme Inc')).toBeTruthy();
    expect(screen.getByText('Workspace')).toBeTruthy();
  });

  it('renders favorites section above main nav when favorites prop is provided', () => {
    render(
      <SideBar
        favorites={{
          items: [{ key: 'fav-1', label: 'Pinned dashboard', href: '/d/1' }],
        }}
        menuItems={[{ key: 'home', label: 'Home' }]}
      />,
    );

    expect(screen.getByText('Pinned dashboard')).toBeTruthy();
    expect(screen.getByText('Favorites')).toBeTruthy();
  });

  it('omits favorites section when no items are visible', () => {
    render(
      <SideBar
        favorites={{
          items: [
            {
              key: 'gated',
              label: 'Gated',
              access: { rules: [{ action: 'read', subject: 'gated' }] },
            },
          ],
        }}
        canAccess={() => false}
        menuItems={[{ key: 'home', label: 'Home' }]}
      />,
    );

    expect(screen.queryByText('Favorites')).toBeNull();
    expect(screen.queryByText('Gated')).toBeNull();
  });
});
