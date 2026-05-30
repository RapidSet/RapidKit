import { useAccessResolver } from '@lib/use-access-resolver';
import { cn } from '@lib/utils';
import { Chip } from '@components/Chip';
import { Icon } from '@components/Icon';
import { Text } from '@components/Text';
import {
  STAT_CARD_BASE_CLASSES,
  STAT_CARD_INTERACTIVE_CLASSES,
  STAT_CARD_TREND_CHIP_CLASSES,
  STAT_CARD_TREND_ICONS,
} from './consts';
import { resolveStatCardAccessState } from './helpers';
import type { StatCardProps } from './types';

export const StatCard = (props: StatCardProps) => {
  const {
    label,
    value,
    icon,
    delta,
    trend = 'neutral',
    description,
    className,
    valueClassName,
    onClick,
    ariaLabel,
    access,
    canAccess,
  } = props;

  const resolvedCanAccess = useAccessResolver(canAccess);
  const { canView, canEdit } = resolveStatCardAccessState(
    access,
    resolvedCanAccess,
  );

  if (!canView) {
    return null;
  }

  const interactive = Boolean(onClick) && canEdit;
  const TrendIcon = STAT_CARD_TREND_ICONS[trend];

  const body = (
    <>
      <div className="flex items-center justify-between gap-2">
        <Text as="p" tone="muted" className="text-xs">
          {label}
        </Text>
        {icon ? (
          <Icon icon={icon} className="h-4 w-4 text-muted-foreground" />
        ) : null}
      </div>
      <Text
        as="p"
        className={cn(
          'mt-3 text-2xl font-semibold text-foreground',
          valueClassName,
        )}
      >
        {value}
      </Text>
      {delta || description ? (
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {delta ? (
            <Chip
              label={delta}
              icon={TrendIcon}
              variant="outline"
              size="sm"
              className={STAT_CARD_TREND_CHIP_CLASSES[trend]}
            />
          ) : null}
          {description ? (
            <Text as="p" tone="muted" className="text-xs">
              {description}
            </Text>
          ) : null}
        </div>
      ) : null}
    </>
  );

  if (interactive) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={ariaLabel ?? label}
        className={cn(
          STAT_CARD_BASE_CLASSES,
          STAT_CARD_INTERACTIVE_CLASSES,
          className,
        )}
      >
        {body}
      </button>
    );
  }

  return <div className={cn(STAT_CARD_BASE_CLASSES, className)}>{body}</div>;
};

StatCard.displayName = 'StatCard';
