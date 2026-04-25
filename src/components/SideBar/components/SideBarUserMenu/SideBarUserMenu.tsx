import { ChevronsUpDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@ui/sidebar';
import { cn } from '@lib/utils';
import { canViewUserAction, resolveNodeAccessState } from '../../helpers';
import type { SideBarUserMenuProps } from '../../types';

const initials = (name: string) =>
  name
    .split(' ')
    .map((token) => token.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();

const avatarFrameClass =
  'flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-full [&_*]:h-full [&_*]:w-full';

export function SideBarUserMenu(props: Readonly<SideBarUserMenuProps>) {
  const {
    className,
    user,
    actions = [],
    access,
    canAccess,
    readOnly = false,
  } = props;
  const { isMobile, open } = useSidebar();
  const { canView } = resolveNodeAccessState(access, canAccess);

  if (!canView) {
    return null;
  }

  const visibleActions = actions.filter((action) =>
    canViewUserAction(action, canAccess),
  );

  return (
    <SidebarMenu className={className}>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="cursor-pointer bg-transparent text-sidebar-foreground hover:bg-sidebar-foreground/5 hover:text-sidebar-foreground active:bg-transparent active:text-sidebar-foreground data-[state=open]:bg-sidebar-foreground/8 data-[state=open]:text-sidebar-foreground dark:hover:bg-sidebar-foreground/10 dark:data-[state=open]:bg-sidebar-foreground/14 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:rounded-full"
            >
              {user.avatar ? (
                <div className={avatarFrameClass}>{user.avatar}</div>
              ) : (
                <div className="flex size-6 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground text-[10px] font-semibold">
                  {initials(user.name)}
                </div>
              )}
              <div
                className={cn(
                  'grid overflow-hidden text-left text-xs leading-tight transition-all duration-200 ease-out group-data-[collapsible=icon]:hidden',
                  open
                    ? 'flex-1 max-w-[16rem] opacity-100 translate-x-0'
                    : 'w-0 max-w-0 flex-none opacity-0 -translate-x-1',
                )}
                aria-hidden={!open}
              >
                <span className="truncate font-semibold">{user.name}</span>
                {user.email ? (
                  <span className="truncate text-xs text-sidebar-foreground/70">
                    {user.email}
                  </span>
                ) : null}
              </div>
              <ChevronsUpDown
                className={cn(
                  'transition-all duration-200 ease-out group-data-[collapsible=icon]:hidden',
                  open
                    ? 'ml-auto size-4 opacity-100 translate-x-0'
                    : 'ml-0 size-0 opacity-0 translate-x-1',
                )}
                aria-hidden="true"
              />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg border-sidebar-border bg-white text-sidebar-foreground dark:bg-sidebar dark:text-sidebar-foreground"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-2.5 py-2 text-left text-xs">
                {user.avatar ? (
                  <div className={avatarFrameClass}>{user.avatar}</div>
                ) : (
                  <div className="flex size-6 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground text-[10px] font-semibold">
                    {initials(user.name)}
                  </div>
                )}
                <div className="grid flex-1 text-left text-xs leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  {user.email ? (
                    <span className="truncate text-xs text-sidebar-foreground/70">
                      {user.email}
                    </span>
                  ) : null}
                </div>
              </div>
            </DropdownMenuLabel>
            {visibleActions.length > 0 ? (
              <>
                <DropdownMenuSeparator className="bg-sidebar-border" />
                <DropdownMenuGroup>
                  {visibleActions.map((action) => {
                    const { canEdit } = resolveNodeAccessState(
                      action.access,
                      canAccess,
                    );
                    const actionDisabled =
                      readOnly || action.disabled || !canEdit;

                    return (
                      <DropdownMenuItem
                        key={action.key}
                        disabled={actionDisabled}
                        onClick={() => {
                          if (!actionDisabled) {
                            action.onSelect?.();
                          }
                        }}
                        className={cn(
                          'cursor-pointer gap-1.5 text-xs focus:bg-transparent focus:text-sidebar-primary data-[highlighted]:bg-transparent data-[highlighted]:text-sidebar-primary',
                          actionDisabled && 'opacity-70',
                        )}
                      >
                        {action.icon ? (
                          <action.icon
                            className="size-3.5"
                            aria-hidden="true"
                          />
                        ) : null}
                        <span className="text-xs leading-none">
                          {action.label}
                        </span>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuGroup>
              </>
            ) : null}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
