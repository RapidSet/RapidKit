import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
} from '@ui/sidebar';
import { cn } from '@lib/utils';
import { resolveSideBarAccessState } from './helpers';
import { SideBarBrand } from './components/SideBarBrand';
import { SideBarNavMenu } from './components/SideBarNavMenu';
import { SideBarUserMenu } from './components/SideBarUserMenu';
import type { SideBarProps } from './types';

export function SideBar(props: Readonly<SideBarProps>) {
  const {
    children,
    brand,
    navigation,
    footer,
    menuItems = [],
    user,
    userActions,
    showHeaderSeparator = true,
    showRail = true,
    headerClassName,
    contentClassName,
    footerClassName,
    providerProps,
    access,
    canAccess,
    className,
    collapsible = 'icon',
    ...sidebarProps
  } = props;

  const { canView, canEdit } = resolveSideBarAccessState(access, canAccess);

  if (!canView) {
    return null;
  }

  const composedBody = children ?? (
    <>
      <SidebarHeader className={headerClassName}>
        {brand ?? <SideBarBrand readOnly={!canEdit} canAccess={canAccess} />}
      </SidebarHeader>
      {showHeaderSeparator ? <SidebarSeparator /> : null}
      <SidebarContent className={contentClassName}>
        {navigation ?? (
          <SideBarNavMenu
            items={menuItems}
            readOnly={!canEdit}
            canAccess={canAccess}
          />
        )}
      </SidebarContent>
      <SidebarFooter className={footerClassName}>
        {footer ??
          (user ? (
            <SideBarUserMenu
              user={user}
              actions={userActions}
              readOnly={!canEdit}
              canAccess={canAccess}
            />
          ) : null)}
      </SidebarFooter>
      {showRail ? <SidebarRail /> : null}
    </>
  );

  return (
    <SidebarProvider {...providerProps}>
      <Sidebar
        collapsible={collapsible}
        className={cn('text-sidebar-foreground', className)}
        {...sidebarProps}
      >
        {composedBody}
      </Sidebar>
    </SidebarProvider>
  );
}
