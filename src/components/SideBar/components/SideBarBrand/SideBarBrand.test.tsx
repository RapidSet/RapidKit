import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { Sidebar, SidebarProvider } from '@ui/sidebar';
import { SideBarBrand } from './SideBarBrand';

const renderWithSidebarContext = (ui: React.ReactElement) =>
  render(
    <SidebarProvider>
      <Sidebar>{ui}</Sidebar>
    </SidebarProvider>,
  );

describe('SideBarBrand', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders title and subtitle', () => {
    renderWithSidebarContext(
      <SideBarBrand title="Workspace" subtitle="Starter Plan" />,
    );

    expect(screen.getByText('Workspace')).toBeTruthy();
    expect(screen.getByText('Starter Plan')).toBeTruthy();
  });

  it('returns null when view access is denied', () => {
    renderWithSidebarContext(
      <SideBarBrand
        title="Workspace"
        accessRequirements={['branding.read']}
        resolveAccess={() => false}
      />,
    );

    expect(screen.queryByText('Workspace')).toBeNull();
  });

  it('applies readOnly visuals when requested', () => {
    const { container } = renderWithSidebarContext(
      <SideBarBrand title="Workspace" readOnly />,
    );

    expect(container.querySelector('.pointer-events-none')).toBeTruthy();
  });
});
