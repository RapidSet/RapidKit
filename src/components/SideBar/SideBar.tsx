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
import { resolveSideBarAccessState } from '@components/SideBar/helpers';
import { SideBarAccessProvider } from '@components/SideBar/access-context';
import { useSideBarAccessResolver } from '@components/SideBar/access-hook';
import { SideBarBrand } from '@components/SideBar/components/SideBarBrand';
import { SideBarFavoritesSection } from '@components/SideBar/components/SideBarFavoritesSection';
import { SideBarNavMenu } from '@components/SideBar/components/SideBarNavMenu';
import { SideBarUserMenu } from '@components/SideBar/components/SideBarUserMenu';
import { SideBarWorkspaceSwitch } from '@components/SideBar/components/SideBarWorkspaceSwitch';
import type { SideBarProps } from '@components/SideBar/types';

export function SideBar(props: Readonly<SideBarProps>) {
  const {
    children,
    brand,
    navigation,
    footer,
    menuItems = [],
    workspace,
    favorites,
    itemVariant,
    user,
    userActions,
    showHeaderSeparator = true,
    showRail = true,
    headerClassName,
    contentClassName,
    footerClassName,
    mainContent,
    providerProps,
    access,
    canAccess,
    className,
    collapsible = 'icon',
    ...sidebarProps
  } = props;

  const resolvedCanAccess = useSideBarAccessResolver(canAccess);

  const { canView, canEdit } = resolveSideBarAccessState(
    access,
    resolvedCanAccess,
  );

  if (!canView) {
    return null;
  }

  const footerNode =
    footer ??
    (user ? (
      <SideBarUserMenu
        user={user}
        actions={userActions}
        readOnly={!canEdit}
        canAccess={canAccess}
      />
    ) : null);

  const composedBody = children ?? (
    <>
      <SidebarHeader className={headerClassName}>
        {brand ?? <SideBarBrand readOnly={!canEdit} canAccess={canAccess} />}
        {workspace ? (
          <SideBarWorkspaceSwitch
            workspace={workspace}
            readOnly={!canEdit}
            canAccess={canAccess}
          />
        ) : null}
      </SidebarHeader>
      {showHeaderSeparator ? <SidebarSeparator /> : null}
      <SidebarContent className={contentClassName}>
        {navigation ?? (
          <>
            {favorites ? (
              <SideBarFavoritesSection
                favorites={favorites}
                itemVariant={itemVariant ?? 'pill'}
                readOnly={!canEdit}
                canAccess={canAccess}
              />
            ) : null}
            <SideBarNavMenu
              items={menuItems}
              itemVariant={itemVariant}
              readOnly={!canEdit}
              canAccess={canAccess}
            />
          </>
        )}
      </SidebarContent>
      {footerNode ? (
        <SidebarFooter className={footerClassName}>{footerNode}</SidebarFooter>
      ) : null}
      {showRail ? <SidebarRail /> : null}
    </>
  );

  return (
    <SideBarAccessProvider canAccess={resolvedCanAccess}>
      <SidebarProvider {...providerProps}>
        <Sidebar
          collapsible={collapsible}
          className={cn('text-sidebar-foreground', className)}
          {...sidebarProps}
        >
          {composedBody}
        </Sidebar>
        {mainContent}
      </SidebarProvider>
    </SideBarAccessProvider>
  );
}
