import { cn } from '@lib/utils';
import { hasDescription } from '@components/NavMenu/helpers';
import { Icon } from '@components/Icon';
import { NavMenuItemBadge } from '../NavMenuItemBadge';
import type { NavMenuItemContentProps } from './types';

export function NavMenuItemContent(props: Readonly<NavMenuItemContentProps>) {
  const { item, descriptionClassName } = props;

  if (!hasDescription(item)) {
    return (
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          {item.icon ? (
            <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center text-muted-foreground transition-colors group-hover/item:text-primary group-focus-visible/item:text-primary [&_svg]:h-4 [&_svg]:w-4">
              <Icon aria-hidden="true" icon={item.icon} className="h-4 w-4" />
            </span>
          ) : null}
          <span className="font-medium leading-none transition-colors group-hover/item:text-primary group-focus-visible/item:text-primary">
            {item.label}
          </span>
        </div>
        <NavMenuItemBadge item={item} />
      </div>
    );
  }

  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-start gap-2.5">
        {item.icon ? (
          <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center text-muted-foreground transition-colors group-hover/item:text-primary group-focus-visible/item:text-primary [&_svg]:h-4 [&_svg]:w-4">
            <Icon aria-hidden="true" icon={item.icon} className="h-4 w-4" />
          </span>
        ) : null}
        <div className="space-y-1">
          <span className="block font-medium leading-none transition-colors group-hover/item:text-primary group-focus-visible/item:text-primary">
            {item.label}
          </span>
          <span
            className={cn(
              'block text-sm leading-snug text-muted-foreground transition-colors group-hover/item:text-primary group-focus-visible/item:text-primary',
              descriptionClassName,
            )}
          >
            {item.description}
          </span>
        </div>
      </div>
      <NavMenuItemBadge item={item} />
    </div>
  );
}
