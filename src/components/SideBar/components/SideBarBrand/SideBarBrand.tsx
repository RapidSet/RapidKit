import { Logo } from '@components/Logo';
import { useSidebar } from '@ui/sidebar';
import { cn } from '@lib/utils';
import { resolveNodeAccessState } from '../../helpers';
import type { SideBarBrandProps } from '../../types';

export function SideBarBrand(props: Readonly<SideBarBrandProps>) {
  const {
    className,
    title,
    subtitle,
    logo,
    renderLogo,
    accessRequirements,
    resolveAccess,
    readOnly = false,
  } = props;
  const { open } = useSidebar();
  const { canView } = resolveNodeAccessState(accessRequirements, resolveAccess);

  if (!canView) {
    return null;
  }

  const resolvedLogo = renderLogo
    ? renderLogo(open)
    : (logo ?? <Logo open={open} size="medium" testId="sidebar-brand" />);

  return (
    <div
      className={cn(
        'flex items-center gap-2',
        readOnly && 'pointer-events-none opacity-80',
        className,
      )}
    >
      {resolvedLogo}
      {open && (title || subtitle) ? (
        <div className="min-w-0">
          {title ? (
            <p className="truncate text-sm font-semibold">{title}</p>
          ) : null}
          {subtitle ? (
            <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
