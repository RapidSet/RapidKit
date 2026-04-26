import { cn } from '@lib/utils';
import { resolveViewEditAccessState } from '@lib/view-edit-access';
import type {
  NavMenuAccessConfig,
  NavMenuAccessResolver,
  NavMenuItem,
} from './types';

export function hasDescription(item: Readonly<NavMenuItem>): boolean {
  return Boolean(item.description?.trim());
}

export function resolveItemRel(
  item: Readonly<NavMenuItem>,
): string | undefined {
  if (!item.external) {
    return item.rel;
  }

  return item.rel ?? 'noopener noreferrer';
}

export function getSectionContentClassName(
  isCompactSection: boolean,
  contentClassName?: string,
): string {
  return cn(
    isCompactSection && 'md:min-w-[14rem]',
    !isCompactSection && 'md:w-[38rem]',
    contentClassName,
  );
}

export function getSectionListClassName(isCompactSection: boolean): string {
  return cn(
    'gap-1 p-2',
    isCompactSection
      ? 'grid min-w-[14rem]'
      : 'grid w-[min(90vw,34rem)] md:w-[38rem] md:grid-cols-2',
  );
}

export function getItemClassName(
  isCompactSection: boolean,
  linkClassName?: string,
): string {
  return cn(
    'group/item block cursor-pointer rounded-md bg-transparent text-sm !text-foreground transition-colors focus-visible:outline-none hover:bg-transparent hover:!text-primary hover:font-medium focus-visible:bg-transparent focus-visible:!text-primary focus-visible:font-medium active:bg-transparent active:!text-primary',
    isCompactSection ? 'px-3 py-2' : 'p-3',
    linkClassName,
  );
}

export const resolveNavMenuAccessState = (
  access: NavMenuAccessConfig | undefined,
  canAccess: NavMenuAccessResolver | undefined,
) => resolveViewEditAccessState(access, canAccess);
