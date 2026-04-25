import { useMemo, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@ui/sidebar';
import { cn } from '@lib/utils';
import {
  canViewMenuItem,
  canViewSubItem,
  resolveNodeAccessState,
} from '../../helpers';
import type { SideBarNavMenuProps } from '../../types';

export function SideBarNavMenu(props: Readonly<SideBarNavMenuProps>) {
  const {
    className,
    items,
    accessRequirements,
    resolveAccess,
    readOnly = false,
  } = props;
  const { canView } = resolveNodeAccessState(accessRequirements, resolveAccess);
  const defaultExpandedItems = useMemo(() => {
    const expandedByDefault: Record<string, boolean> = {};

    items.forEach((item) => {
      const visibleSubItems = (item.items ?? []).filter((subItem) =>
        canViewSubItem(subItem, resolveAccess),
      );

      if (visibleSubItems.length > 0) {
        expandedByDefault[item.key] = Boolean(
          item.isActive || visibleSubItems.some((subItem) => subItem.isActive),
        );
      }
    });

    return expandedByDefault;
  }, [items, resolveAccess]);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {},
  );

  if (!canView) {
    return null;
  }

  const visibleItems = items.filter((item) =>
    canViewMenuItem(item, resolveAccess),
  );
  const hasExplicitGroups = visibleItems.some((item) => Boolean(item.group));
  const groupedItems = visibleItems.reduce<
    Array<{ group: string; items: typeof visibleItems }>
  >((accumulator, item) => {
    const groupName = item.group ?? 'General';
    const existingGroup = accumulator.find(
      (group) => group.group === groupName,
    );

    if (existingGroup) {
      existingGroup.items.push(item);
      return accumulator;
    }

    accumulator.push({ group: groupName, items: [item] });
    return accumulator;
  }, []);

  const renderSubItem = (
    subItem: NonNullable<SideBarNavMenuProps['items'][number]['items']>[number],
  ) => {
    const { canEdit: canEditSubItem } = resolveNodeAccessState(
      subItem.accessRequirements,
      resolveAccess,
    );
    const subItemDisabled = readOnly || subItem.disabled || !canEditSubItem;

    return (
      <SidebarMenuSubItem key={subItem.key}>
        <SidebarMenuSubButton
          asChild
          isActive={subItem.isActive}
          className={cn(
            'cursor-pointer bg-transparent hover:bg-transparent hover:text-sidebar-primary hover:font-medium hover:[&>svg]:stroke-[2.35] active:bg-transparent active:text-sidebar-primary data-[active=true]:bg-transparent data-[active=true]:text-sidebar-primary hover:data-[active=true]:bg-transparent',
            subItemDisabled && 'opacity-70',
          )}
        >
          <a
            href={subItem.href ?? '#'}
            onClick={(event) => {
              if (subItemDisabled) {
                event.preventDefault();
                return;
              }

              if (!subItem.href) {
                event.preventDefault();
              }

              subItem.onSelect?.();
            }}
            aria-disabled={subItemDisabled || undefined}
            className={cn(subItemDisabled && 'pointer-events-none')}
          >
            <span>{subItem.label}</span>
          </a>
        </SidebarMenuSubButton>
      </SidebarMenuSubItem>
    );
  };

  const renderMenuItem = (item: SideBarNavMenuProps['items'][number]) => {
    const { canEdit } = resolveNodeAccessState(
      item.accessRequirements,
      resolveAccess,
    );
    const itemDisabled = readOnly || item.disabled || !canEdit;
    const visibleSubItems = (item.items ?? []).filter((subItem) =>
      canViewSubItem(subItem, resolveAccess),
    );
    const hasSubItems = visibleSubItems.length > 0;
    const isExpanded =
      expandedItems[item.key] ?? defaultExpandedItems[item.key] ?? false;

    return (
      <SidebarMenuItem key={item.key}>
        <SidebarMenuButton
          asChild
          isActive={item.isActive}
          tooltip={{
            children: item.label,
            className:
              'border border-sidebar-border bg-white text-sidebar-foreground shadow-md dark:bg-sidebar dark:text-sidebar-foreground',
          }}
          className={cn(
            'h-9 cursor-pointer bg-transparent hover:bg-transparent hover:text-sidebar-primary hover:font-medium hover:[&>svg]:stroke-[2.35] active:bg-transparent active:text-sidebar-primary data-[state=open]:bg-transparent data-[state=open]:hover:bg-transparent data-[state=open]:text-sidebar-primary data-[active=true]:bg-transparent data-[active=true]:text-sidebar-primary hover:data-[active=true]:bg-transparent',
            itemDisabled && 'opacity-70',
          )}
        >
          <a
            href={item.href ?? '#'}
            onClick={(event) => {
              if (itemDisabled) {
                event.preventDefault();
                return;
              }

              if (hasSubItems) {
                event.preventDefault();
                setExpandedItems((previous) => ({
                  ...previous,
                  [item.key]: !isExpanded,
                }));
                return;
              }

              if (!item.href) {
                event.preventDefault();
              }

              item.onSelect?.();
            }}
            aria-disabled={itemDisabled || undefined}
            aria-expanded={hasSubItems ? isExpanded : undefined}
            className={cn(itemDisabled && 'pointer-events-none')}
          >
            {item.icon ? <item.icon aria-hidden="true" /> : null}
            <span>{item.label}</span>
            {item.badge ? (
              <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
            ) : null}
            {hasSubItems ? (
              <ChevronRight
                aria-hidden="true"
                className={cn(
                  'ml-auto transition-transform duration-150',
                  isExpanded && 'rotate-90',
                )}
              />
            ) : null}
          </a>
        </SidebarMenuButton>
        {hasSubItems && isExpanded ? (
          <SidebarMenuSub>{visibleSubItems.map(renderSubItem)}</SidebarMenuSub>
        ) : null}
      </SidebarMenuItem>
    );
  };

  return (
    <>
      {groupedItems.map((group, groupIndex) => (
        <SidebarGroup className={className} key={group.group}>
          {hasExplicitGroups || groupedItems.length > 1 ? (
            <SidebarGroupLabel className="text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-sidebar-foreground/65">
              {group.group}
            </SidebarGroupLabel>
          ) : null}
          <SidebarGroupContent>
            <SidebarMenu className="gap-2.5 py-1">
              {group.items.map(renderMenuItem)}
            </SidebarMenu>
          </SidebarGroupContent>
          {(hasExplicitGroups || groupedItems.length > 1) &&
          groupIndex < groupedItems.length - 1 ? (
            <div
              className="my-1 border-t border-sidebar-border"
              aria-hidden="true"
            />
          ) : null}
        </SidebarGroup>
      ))}
    </>
  );
}
