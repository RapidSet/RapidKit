import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Sidebar, SidebarProvider } from '@ui/sidebar';
import { SideBarNavMenu } from './SideBarNavMenu';

const renderWithSidebarContext = (ui: React.ReactElement, open = true) =>
  render(
    <SidebarProvider open={open}>
      <Sidebar collapsible="icon">{ui}</Sidebar>
    </SidebarProvider>,
  );

describe('SideBarNavMenu', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders menu items and toggles sub items', () => {
    renderWithSidebarContext(
      <SideBarNavMenu
        items={[
          {
            key: 'settings',
            label: 'Settings',
            items: [{ key: 'users', label: 'Users' }],
          },
        ]}
      />,
    );

    expect(screen.getByRole('link', { name: 'Settings' })).toBeTruthy();
    expect(screen.queryByRole('link', { name: 'Users' })).toBeNull();

    fireEvent.click(screen.getByRole('link', { name: 'Settings' }));
    expect(screen.getByRole('link', { name: 'Users' })).toBeTruthy();

    fireEvent.click(screen.getByRole('link', { name: 'Settings' }));
    expect(screen.queryByRole('link', { name: 'Users' })).toBeNull();
  });

  it('hides item when view access is denied', () => {
    renderWithSidebarContext(
      <SideBarNavMenu
        items={[
          {
            key: 'admin',
            label: 'Admin',
            accessRequirements: ['admin.read'],
          },
        ]}
        resolveAccess={() => false}
      />,
    );

    expect(screen.queryByRole('link', { name: 'Admin' })).toBeNull();
  });

  it('prevents click when edit access is denied', () => {
    const onSelect = vi.fn();

    renderWithSidebarContext(
      <SideBarNavMenu
        items={[
          {
            key: 'billing',
            label: 'Billing',
            accessRequirements: ['billing.write'],
            onSelect,
          },
        ]}
        resolveAccess={(_, mode) => mode === 'view'}
      />,
    );

    const link = screen.getByRole('link', { name: 'Billing' });
    expect(link.getAttribute('aria-disabled')).toBe('true');

    fireEvent.click(link);
    expect(onSelect).toHaveBeenCalledTimes(0);
  });

  it('prevents navigation when href is missing and still calls onSelect', () => {
    const onSelect = vi.fn();

    renderWithSidebarContext(
      <SideBarNavMenu
        items={[{ key: 'dashboard', label: 'Dashboard', onSelect }]}
      />,
    );

    const link = screen.getByRole('link', { name: 'Dashboard' });
    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    });

    link.dispatchEvent(clickEvent);

    expect(clickEvent.defaultPrevented).toBe(true);
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('keeps collapsed submenu trigger disabled when edit access is denied', () => {
    renderWithSidebarContext(
      <SideBarNavMenu
        items={[
          {
            key: 'settings',
            label: 'Settings',
            accessRequirements: ['settings.write'],
            items: [{ key: 'users', label: 'Users', onSelect: vi.fn() }],
          },
        ]}
        resolveAccess={(_, mode) => mode === 'view'}
      />,
      false,
    );

    const trigger = screen.getByRole('button', { name: 'Settings' });
    expect(trigger.getAttribute('disabled')).not.toBeNull();
  });

  it('allows collapsed submenu item click when access permits', () => {
    const onSelect = vi.fn();

    renderWithSidebarContext(
      <SideBarNavMenu
        items={[
          {
            key: 'settings',
            label: 'Settings',
            items: [{ key: 'users', label: 'Users', onSelect }],
          },
        ]}
      />,
      false,
    );

    fireEvent.pointerDown(screen.getByRole('button', { name: 'Settings' }));
    fireEvent.click(screen.getByText('Users'));

    expect(onSelect).toHaveBeenCalledTimes(1);
  });
});
