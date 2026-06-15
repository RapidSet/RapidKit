import { Star } from 'lucide-react';
import { cn } from '@lib/utils';
import { useAccessResolver } from '@lib/use-access-resolver';
import { resolveViewEditAccessState } from '@lib/view-edit-access';
import type { BoardCardProps } from './types';

const SKELETON_ROWS = [
  'bg-primary/55 w-3/5',
  'bg-accent-2/65 w-4/5',
  'bg-accent-3/65 w-3/4',
  'bg-destructive/55 w-2/3',
];

const DefaultPreview = () => (
  <div className="flex h-24 flex-col gap-1.5 rounded-md bg-muted px-3 py-2">
    {SKELETON_ROWS.map((rowClass) => (
      <div key={rowClass} className={cn('h-2 rounded-full', rowClass)} />
    ))}
  </div>
);

export function BoardCard(props: BoardCardProps) {
  const {
    title,
    icon,
    preview,
    breadcrumb,
    starred = false,
    onStarToggle,
    onClick,
    href,
    className,
    ariaLabel,
    access,
    canAccess,
  } = props;

  const resolvedCanAccess = useAccessResolver(canAccess);
  const { canView, canEdit } = resolveViewEditAccessState(
    access,
    resolvedCanAccess,
  );

  if (!canView) {
    return null;
  }

  const Icon = icon;
  const interactive = Boolean(onClick || href) && canEdit;

  const body = (
    <>
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          {Icon ? (
            <Icon className="size-4 shrink-0 text-primary" aria-hidden="true" />
          ) : null}
          <span className="truncate text-sm font-semibold text-foreground">
            {title}
          </span>
        </div>
        {onStarToggle ? (
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onStarToggle();
            }}
            aria-label={starred ? 'Unstar' : 'Star'}
            aria-pressed={starred}
            className={cn(
              'inline-flex size-6 items-center justify-center rounded-md transition-colors',
              starred
                ? 'text-amber-500 hover:bg-amber-500/10'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
          >
            <Star
              className={cn('size-4', starred && 'fill-current')}
              aria-hidden="true"
            />
          </button>
        ) : null}
      </div>
      <div className="mt-3">{preview ?? <DefaultPreview />}</div>
      {breadcrumb && breadcrumb.length > 0 ? (
        <p className="mt-3 truncate text-xs text-muted-foreground">
          {breadcrumb.join(' > ')}
        </p>
      ) : null}
    </>
  );

  const baseClass =
    'group flex flex-col rounded-lg border border-border bg-card p-3 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md';

  if (interactive) {
    if (href) {
      return (
        <a
          href={href}
          aria-label={ariaLabel}
          onClick={() => onClick?.()}
          className={cn(baseClass, 'no-underline', className)}
        >
          {body}
        </a>
      );
    }

    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={ariaLabel}
        className={cn(baseClass, 'text-left', className)}
      >
        {body}
      </button>
    );
  }

  return (
    <div
      aria-label={ariaLabel}
      className={cn(baseClass.replace('group ', ''), className)}
    >
      {body}
    </div>
  );
}

BoardCard.displayName = 'BoardCard';
