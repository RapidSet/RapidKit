import { CheckCircle2, Circle, X } from 'lucide-react';
import { cn } from '@lib/utils';
import { useAccessResolver } from '@lib/use-access-resolver';
import { resolveViewEditAccessState } from '@lib/view-edit-access';
import type {
  OnboardingChecklistItem,
  OnboardingChecklistProps,
} from './types';

const TONE_BAR_CLASSES = {
  primary: 'bg-primary',
  success: 'bg-success',
} as const;

const computeProgress = (items: OnboardingChecklistItem[]) => {
  if (items.length === 0) {
    return 0;
  }
  const completed = items.filter((item) => item.done).length;
  return Math.round((completed / items.length) * 100);
};

export function OnboardingChecklist(props: OnboardingChecklistProps) {
  const {
    title,
    items,
    dismissible = false,
    onDismiss,
    progressTone = 'primary',
    className,
    emptyState,
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

  const progress = computeProgress(items);

  return (
    <section
      aria-label={typeof title === 'string' ? title : undefined}
      className={cn(
        'flex flex-col gap-3 rounded-lg border border-border bg-card p-4 shadow-sm',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold leading-tight text-foreground">
          {title}
        </h3>
        {dismissible ? (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss"
            className="inline-flex size-6 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        ) : null}
      </div>
      {items.length === 0 ? (
        (emptyState ?? (
          <p className="text-xs text-muted-foreground">
            Nothing to complete here.
          </p>
        ))
      ) : (
        <>
          <ul className="flex flex-col gap-2">
            {items.map((item) => {
              const itemDisabled = !canEdit || item.disabled;
              const Icon = item.done ? CheckCircle2 : Circle;
              const interactive = Boolean(item.onSelect || item.href);

              const inner = (
                <>
                  <Icon
                    className={cn(
                      'mt-0.5 size-4 shrink-0',
                      item.done ? 'text-success' : 'text-muted-foreground',
                    )}
                    aria-hidden="true"
                  />
                  <div className="min-w-0 flex-1">
                    <p
                      className={cn(
                        'text-sm leading-tight',
                        item.done
                          ? 'text-muted-foreground line-through'
                          : 'text-foreground',
                      )}
                    >
                      {item.label}
                    </p>
                    {item.description ? (
                      <p className="text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    ) : null}
                  </div>
                </>
              );

              if (!interactive || itemDisabled) {
                return (
                  <li
                    key={item.id}
                    className={cn(
                      'flex items-start gap-2 rounded-md px-1 py-1',
                      itemDisabled && 'opacity-60',
                    )}
                  >
                    {inner}
                  </li>
                );
              }

              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => item.onSelect?.()}
                    className="flex w-full items-start gap-2 rounded-md px-1 py-1 text-left transition-colors hover:bg-muted"
                  >
                    {inner}
                  </button>
                </li>
              );
            })}
          </ul>
          <div
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
          >
            <div
              className={cn(
                'h-full rounded-full transition-all duration-300 ease-out',
                TONE_BAR_CLASSES[progressTone],
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        </>
      )}
    </section>
  );
}

OnboardingChecklist.displayName = 'OnboardingChecklist';
