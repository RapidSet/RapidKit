import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@ui/dropdown-menu';
import { cn } from '@lib/utils';
import { useAccessResolver } from '@lib/use-access-resolver';
import { resolveViewEditAccessState } from '@lib/view-edit-access';
import type {
  TopBarAction,
  TopBarAccessResolver,
  TopBarProps,
  TopBarUserAction,
} from './types';

const initialsFrom = (name: string) =>
  name
    .split(' ')
    .map((token) => token.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();

const TONE_CLASSES = {
  default:
    'text-foreground hover:bg-sidebar-accent/45 hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-ring',
  primary:
    'bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring',
  destructive:
    'text-destructive hover:bg-destructive/10 focus-visible:ring-2 focus-visible:ring-ring',
} as const;

const renderAction = (
  action: TopBarAction,
  canAccess: TopBarAccessResolver | undefined,
) => {
  const { canView, canEdit } = resolveViewEditAccessState(
    action.access,
    canAccess,
  );

  if (!canView) {
    return null;
  }

  const tone = action.tone ?? 'default';
  const disabled = action.disabled || !canEdit;
  const className = cn(
    'relative inline-flex h-9 w-9 items-center justify-center rounded-md transition-colors focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60',
    TONE_CLASSES[tone],
  );

  const inner = (
    <>
      {action.icon ? (
        <action.icon className="size-4" aria-hidden="true" />
      ) : (
        <span className="text-xs">{action.label.charAt(0)}</span>
      )}
      <span className="sr-only">{action.label}</span>
      {action.badge ? (
        <span className="absolute -right-0.5 -top-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground">
          {action.badge}
        </span>
      ) : null}
    </>
  );

  if (action.href && !disabled) {
    return (
      <a
        key={action.key}
        href={action.href}
        aria-label={action.label}
        onClick={() => action.onSelect?.()}
        className={className}
      >
        {inner}
      </a>
    );
  }

  return (
    <button
      key={action.key}
      type="button"
      aria-label={action.label}
      disabled={disabled}
      onClick={() => {
        if (!disabled) {
          action.onSelect?.();
        }
      }}
      className={className}
    >
      {inner}
    </button>
  );
};

const renderUserMenu = (
  userMenu: TopBarUserAction[],
  canAccess: TopBarAccessResolver | undefined,
) =>
  userMenu
    .filter((action) => {
      const { canView } = resolveViewEditAccessState(action.access, canAccess);
      return canView;
    })
    .map((action) => {
      const { canEdit } = resolveViewEditAccessState(action.access, canAccess);
      const disabled = action.disabled || !canEdit;
      return (
        <DropdownMenuItem
          key={action.key}
          disabled={disabled}
          onClick={() => {
            if (!disabled) {
              action.onSelect?.();
            }
          }}
          className="cursor-pointer gap-2 text-xs"
        >
          {action.icon ? (
            <action.icon className="size-3.5" aria-hidden="true" />
          ) : null}
          <span className="leading-none">{action.label}</span>
        </DropdownMenuItem>
      );
    });

export function TopBar(props: TopBarProps) {
  const {
    title,
    subtitle,
    leadingActions = [],
    trailingActions = [],
    quickAction,
    user,
    userMenu = [],
    className,
    access,
    canAccess,
  } = props;

  const resolvedCanAccess = useAccessResolver(canAccess);
  const { canView } = resolveViewEditAccessState(access, resolvedCanAccess);

  if (!canView) {
    return null;
  }

  const quickActionDisabled = (() => {
    if (!quickAction) {
      return false;
    }
    const { canEdit } = resolveViewEditAccessState(
      quickAction.access,
      resolvedCanAccess,
    );
    return Boolean(quickAction.disabled) || !canEdit;
  })();

  return (
    <header
      className={cn(
        'flex items-center justify-between gap-4 border-b border-border bg-background px-4 py-3 md:px-6',
        className,
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {leadingActions.length > 0 ? (
          <div className="flex items-center gap-1">
            {leadingActions.map((action) =>
              renderAction(action, resolvedCanAccess),
            )}
          </div>
        ) : null}
        <div className="min-w-0">
          {title ? (
            <h1 className="truncate text-base font-semibold leading-tight text-foreground md:text-lg">
              {title}
            </h1>
          ) : null}
          {subtitle ? (
            <p className="truncate text-xs text-muted-foreground md:text-sm">
              {subtitle}
            </p>
          ) : null}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {quickAction ? (
          <button
            type="button"
            disabled={quickActionDisabled}
            onClick={() => {
              if (!quickActionDisabled) {
                quickAction.onSelect?.();
              }
            }}
            className={cn(
              'inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60',
            )}
          >
            {quickAction.icon ? (
              <quickAction.icon className="size-4" aria-hidden="true" />
            ) : null}
            <span>{quickAction.label}</span>
          </button>
        ) : null}
        {trailingActions.length > 0 ? (
          <div className="flex items-center gap-0.5">
            {trailingActions.map((action) =>
              renderAction(action, resolvedCanAccess),
            )}
          </div>
        ) : null}
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label={`Account menu for ${user.name}`}
                className="inline-flex size-8 items-center justify-center overflow-hidden rounded-full bg-rose-500 text-xs font-bold text-white transition-shadow hover:ring-2 hover:ring-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt=""
                    className="size-full object-cover"
                  />
                ) : (
                  <span>{user.initials ?? initialsFrom(user.name)}</span>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-52">
              <DropdownMenuLabel className="font-normal">
                <div className="grid text-left text-xs leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  {user.email ? (
                    <span className="truncate text-muted-foreground">
                      {user.email}
                    </span>
                  ) : null}
                </div>
              </DropdownMenuLabel>
              {userMenu.length > 0 ? (
                <>
                  <DropdownMenuSeparator />
                  {renderUserMenu(userMenu, resolvedCanAccess)}
                </>
              ) : null}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </div>
    </header>
  );
}

TopBar.displayName = 'TopBar';
