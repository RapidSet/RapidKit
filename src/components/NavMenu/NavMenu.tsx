import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@ui/navigation-menu';
import { cn } from '@lib/utils';
import { NavMenuItemContent } from './components';
import {
  getItemClassName,
  getSectionContentClassName,
  getSectionListClassName,
  hasDescription,
  resolveNavMenuAccessState,
  resolveItemRel,
} from './helpers';
import { useAccessResolver } from '@lib/use-access-resolver';
import type { NavMenuProps } from './types';

export const NavMenu = (props: Readonly<NavMenuProps>) => {
  const {
    sections,
    className,
    listClassName,
    triggerClassName,
    contentClassName,
    linkClassName,
    descriptionClassName,
    viewportClassName,
    ariaLabel = 'Navigation menu',
    access,
    canAccess,
    value,
    onValueChange,
    dir,
    orientation,
    delayDuration,
    skipDelayDuration,
    renderItem,
  } = props;

  const resolvedCanAccess = useAccessResolver(canAccess);
  const { canView, canEdit } = resolveNavMenuAccessState(
    access,
    resolvedCanAccess,
  );

  if (!canView) {
    return null;
  }

  return (
    <NavigationMenu
      className={cn('w-full justify-start', className)}
      viewportClassName={viewportClassName}
      value={value}
      onValueChange={onValueChange}
      dir={dir}
      orientation={orientation}
      delayDuration={delayDuration}
      skipDelayDuration={skipDelayDuration}
      aria-label={ariaLabel}
    >
      <NavigationMenuList className={cn('justify-start', listClassName)}>
        {sections.map((section, sectionIndex) => {
          const sectionKey = section.id ?? `${section.label}-${sectionIndex}`;
          const isCompactSection = section.items.every(
            (item) => !hasDescription(item),
          );

          return (
            <NavigationMenuItem key={sectionKey}>
              <NavigationMenuTrigger className={triggerClassName}>
                {section.label}
              </NavigationMenuTrigger>
              <NavigationMenuContent
                className={getSectionContentClassName(
                  isCompactSection,
                  contentClassName,
                )}
              >
                <ul className={getSectionListClassName(isCompactSection)}>
                  {section.items.map((item, itemIndex) => {
                    const itemKey =
                      item.id ?? `${sectionKey}-${item.label}-${itemIndex}`;
                    const itemBody = renderItem ? (
                      renderItem(item)
                    ) : (
                      <NavMenuItemContent
                        item={item}
                        descriptionClassName={descriptionClassName}
                      />
                    );
                    const itemClassName = getItemClassName(
                      isCompactSection,
                      linkClassName,
                    );
                    const isDisabled = item.disabled || !canEdit;

                    if (isDisabled) {
                      return (
                        <li key={itemKey}>
                          <NavigationMenuLink asChild>
                            <span
                              aria-disabled="true"
                              className={cn(
                                itemClassName,
                                'cursor-not-allowed opacity-50',
                              )}
                            >
                              {itemBody}
                            </span>
                          </NavigationMenuLink>
                        </li>
                      );
                    }

                    return (
                      <li key={itemKey}>
                        <NavigationMenuLink asChild>
                          <a
                            href={item.href}
                            target={
                              item.target ??
                              (item.external ? '_blank' : undefined)
                            }
                            rel={resolveItemRel(item)}
                            className={itemClassName}
                          >
                            {itemBody}
                          </a>
                        </NavigationMenuLink>
                      </li>
                    );
                  })}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
};
