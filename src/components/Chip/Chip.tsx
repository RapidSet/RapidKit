import { cn } from '@lib/utils';
import { X } from 'lucide-react';
import { Icon } from '../Icon';
import {
  CHIP_CLOSE_ICON_SIZE_CLASSES,
  CHIP_ICON_SIZE_CLASSES,
  CHIP_SIZE_CLASSES,
  CHIP_VARIANT_CLASSES,
} from './consts';
import { resolveChipAccessState } from './helpers';
import type { ChipProps } from './types';

export const Chip = (props: ChipProps) => {
  const {
    label,
    icon,
    className,
    iconClassName,
    variant = 'primary',
    size = 'md',
    pulse = false,
    onRemove,
    accessRequirements,
    resolveAccess,
    disabled,
    ...rest
  } = props;

  const { canView, canEdit } = resolveChipAccessState(
    accessRequirements,
    resolveAccess,
  );

  if (!canView) {
    return null;
  }

  const resolvedDisabled = disabled || !canEdit;

  return (
    <div
      className={cn(
        'inline-flex items-center justify-between gap-1.5',
        'border rounded-full',
        'capitalize',
        'overflow-hidden',
        'whitespace-nowrap',
        CHIP_VARIANT_CLASSES[variant],
        CHIP_SIZE_CLASSES[size],
        className,
      )}
      {...rest}
    >
      {icon && (
        <span className={cn(pulse && 'motion-safe:animate-pulse')}>
          <Icon
            icon={icon}
            className={cn(CHIP_ICON_SIZE_CLASSES[size], iconClassName)}
          />
        </span>
      )}
      {label && (
        <span className="block overflow-hidden text-ellipsis">{label}</span>
      )}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="rounded-full p-0.5 transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label={label ? `Remove ${label}` : 'Remove chip'}
          disabled={resolvedDisabled}
        >
          <X className={cn(CHIP_CLOSE_ICON_SIZE_CLASSES[size])} />
        </button>
      )}
    </div>
  );
};
