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
});
