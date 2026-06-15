import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@ui/sidebar';
import { cn } from '@lib/utils';
import { useSideBarAccessResolver } from '@components/SideBar/access-hook';
import { resolveNodeAccessState } from '@components/SideBar/helpers';
import type { SideBarWorkspaceSwitchProps } from '@components/SideBar/types';

const initials = (name: string) =>
  name
    .split(' ')
    .map((token) => token.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();

export function SideBarWorkspaceSwitch(
  props: Readonly<SideBarWorkspaceSwitchProps>,
) {
  const { className, workspace, access, canAccess, readOnly = false } = props;
  const resolvedCanAccess = useSideBarAccessResolver(canAccess);
  const { open, isMobile } = useSidebar();
  const { canView, canEdit } = resolveNodeAccessState(
    access ?? workspace.access,
    resolvedCanAccess,
  );

  if (!canView) {
    return null;
  }

  const visibleActions = (workspace.actions ?? []).filter((action) => {
    const { canView: canViewAction } = resolveNodeAccessState(
      action.access,
      resolvedCanAccess,
    );
    return canViewAction;
  });

  const disabled = readOnly || !canEdit;
  const hasDropdown = visibleActions.length > 0;
  const avatar = workspace.avatar ?? (
    <div className="flex size-7 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground text-[11px] font-bold">
      {workspace.initials ?? initials(workspace.name)}
    </div>
  );

  const buttonContent = (
    <>
      <div className="flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-md">
        {avatar}
      </div>
      <div
        className={cn(
          'grid overflow-hidden text-left transition-all duration-200 ease-out group-data-[collapsible=icon]:hidden',
          open
            ? 'flex-1 opacity-100 translate-x-0'
            : 'w-0 max-w-0 flex-none opacity-0 -translate-x-1',
        )}
        aria-hidden={!open}
      >
        <span className="truncate text-sm font-semibold">{workspace.name}</span>
        {workspace.subtitle ? (
          <span className="truncate text-[11px] text-sidebar-foreground/70">
            {workspace.subtitle}
          </span>
        ) : null}
      </div>
      {hasDropdown ? (
        <ChevronDown
          className={cn(
            'transition-all duration-200 ease-out group-data-[collapsible=icon]:hidden',
            open
              ? 'ml-auto size-4 opacity-100 translate-x-0'
              : 'ml-0 size-0 opacity-0 translate-x-1',
          )}
          aria-hidden="true"
        />
      ) : null}
    </>
  );

  const buttonClassName = cn(
    'cursor-pointer rounded-md bg-transparent text-sidebar-foreground hover:bg-sidebar-accent/55 hover:text-sidebar-accent-foreground data-[state=open]:bg-sidebar-accent/65 data-[state=open]:text-sidebar-accent-foreground active:bg-sidebar-accent/65 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0',
    disabled && 'pointer-events-none opacity-70',
  );

  if (!hasDropdown) {
    return (
      <SidebarMenu className={className}>
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            size="lg"
            className={buttonClassName}
            onClick={() => workspace.onSelect?.()}
          >
            <a
              href={workspace.href ?? '#'}
              onClick={(event) => {
                if (disabled) {
                  event.preventDefault();
                  return;
                }
                if (!workspace.href) {
                  event.preventDefault();
                }
                workspace.onSelect?.();
              }}
              aria-disabled={disabled || undefined}
            >
              {buttonContent}
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu className={className}>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg" className={buttonClassName}>
              {buttonContent}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg border-sidebar-border bg-white text-sidebar-foreground dark:bg-sidebar dark:text-sidebar-foreground"
            side={isMobile ? 'bottom' : 'right'}
            align="start"
            sideOffset={4}
          >
            {visibleActions.map((action) => {
              const { canEdit: canEditAction } = resolveNodeAccessState(
                action.access,
                resolvedCanAccess,
              );
              const actionDisabled =
                readOnly || action.disabled || !canEditAction;

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
                    <action.icon className="size-3.5" aria-hidden="true" />
                  ) : null}
                  <span className="text-xs leading-none">{action.label}</span>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
