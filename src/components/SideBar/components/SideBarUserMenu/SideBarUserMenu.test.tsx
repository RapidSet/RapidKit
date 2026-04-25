import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Sidebar, SidebarProvider } from '@ui/sidebar';
import { SideBarUserMenu } from './SideBarUserMenu';

const renderWithSidebarContext = (ui: React.ReactElement) =>
  render(
    <SidebarProvider>
      <Sidebar>{ui}</Sidebar>
    </SidebarProvider>,
  );

describe('SideBarUserMenu', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders user details with initials fallback', () => {
    renderWithSidebarContext(
      <SideBarUserMenu
        user={{ name: 'Alex Doe', email: 'alex@example.com' }}
      />,
    );

    expect(screen.getByText('Alex Doe')).toBeTruthy();
    expect(screen.getByText('alex@example.com')).toBeTruthy();
    expect(screen.getAllByText('AD').length > 0).toBe(true);
  });

  it('hides actions that fail view access', () => {
    renderWithSidebarContext(
      <SideBarUserMenu
        user={{ name: 'Alex Doe' }}
        actions={[
          {
            key: 'admin',
            label: 'Admin',
            accessRequirements: ['admin.read'],
          },
        ]}
        resolveAccess={() => false}
      />,
    );

    const trigger = screen.getAllByRole('button', { name: /alex doe/i }).at(0);
    expect(trigger).toBeTruthy();
    fireEvent.click(trigger!);
    expect(screen.queryByText('Admin')).toBeNull();
  });

  it('renders user trigger when readOnly is true', () => {
    renderWithSidebarContext(
      <SideBarUserMenu
        user={{ name: 'Alex Doe' }}
        actions={[{ key: 'logout', label: 'Log out', onSelect: vi.fn() }]}
        readOnly
      />,
    );

    const trigger = screen.getAllByRole('button', { name: /alex doe/i }).at(0);
    expect(trigger).toBeTruthy();
  });
});
