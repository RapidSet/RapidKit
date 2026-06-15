import { useState } from 'react';
import { ChevronDown, Star } from 'lucide-react';
import { SidebarGroup, SidebarGroupContent } from '@ui/sidebar';
import { cn } from '@lib/utils';
import { useSideBarAccessResolver } from '@components/SideBar/access-hook';
import {
  canViewMenuItem,
  resolveNodeAccessState,
} from '@components/SideBar/helpers';
import { SideBarNavMenu } from '@components/SideBar/components/SideBarNavMenu';
import type { SideBarFavoritesSectionProps } from '@components/SideBar/types';

export function SideBarFavoritesSection(
  props: Readonly<SideBarFavoritesSectionProps>,
) {
  const {
    className,
    favorites,
    itemVariant = 'pill',
    access,
    canAccess,
    readOnly = false,
  } = props;
  const resolvedCanAccess = useSideBarAccessResolver(canAccess);
  const { canView } = resolveNodeAccessState(
    access ?? favorites.access,
    resolvedCanAccess,
  );
  const [open, setOpen] = useState(favorites.defaultOpen ?? true);

  if (!canView) {
    return null;
  }

  const visibleItems = favorites.items.filter((item) =>
    canViewMenuItem(item, resolvedCanAccess),
  );

  if (visibleItems.length === 0) {
    return null;
  }

  const label = favorites.label ?? 'Favorites';
  const sectionId = `sidebar-favorites-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <SidebarGroup
      className={cn('group-data-[collapsible=icon]:hidden', className)}
    >
      <button
        type="button"
        onClick={() => setOpen((previous) => !previous)}
        aria-expanded={open}
        aria-controls={sectionId}
        className="flex w-full items-center gap-1.5 px-2 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-sidebar-foreground/65 hover:text-sidebar-foreground"
      >
        <Star className="size-3.5" aria-hidden="true" />
        <span>{label}</span>
        <ChevronDown
          aria-hidden="true"
          className={cn(
            'ml-auto size-3.5 transition-transform duration-150',
            open ? 'rotate-0' : '-rotate-90',
          )}
        />
      </button>
      <div
        id={sectionId}
        aria-hidden={!open}
        className={cn(
          'grid overflow-hidden transition-all duration-200 ease-out',
          open
            ? 'grid-rows-[1fr] opacity-100'
            : 'grid-rows-[0fr] opacity-0 pointer-events-none',
        )}
      >
        <div className="min-h-0">
          <SidebarGroupContent>
            <SideBarNavMenu
              items={visibleItems}
              itemVariant={itemVariant}
              canAccess={canAccess}
              readOnly={readOnly}
            />
          </SidebarGroupContent>
        </div>
      </div>
    </SidebarGroup>
  );
}
