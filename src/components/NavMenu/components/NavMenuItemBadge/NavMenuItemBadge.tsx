import { cn } from '@lib/utils';
import type { NavMenuItemBadgeProps } from './types';

export function NavMenuItemBadge(props: Readonly<NavMenuItemBadgeProps>) {
  const { item, className } = props;

  if (item.disabled) {
    return (
      <span
        className={cn(
          'rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground transition-colors group-hover/item:text-primary group-focus-visible/item:text-primary',
          className,
        )}
      >
        Soon
      </span>
    );
  }

  if (item.external) {
    return (
      <span
        className={cn(
          'rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground transition-colors group-hover/item:text-primary group-focus-visible/item:text-primary',
          className,
        )}
      >
        External
      </span>
    );
  }

  return null;
}
