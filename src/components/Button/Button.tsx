import { forwardRef, type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@lib/utils';
import { Button as UIButton } from '@ui/button';
import { Icon } from '../Icon';
import { resolveButtonAccessState } from './helpers';
import {
  BUTTON_VARIANT_CLASS_NAMES,
  BUTTON_VARIANT_MAPPING,
  ButtonVariant,
} from './styles';
import type { ButtonProps } from './types';

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    const {
      label,
      children,
      loading = false,
      leftIcon,
      rightIcon,
      variant = ButtonVariant.Default,
      size,
      className,
      accessRequirements,
      resolveAccess,
      accessDeniedBehavior = 'disable',
      disabled,
      ...rest
    } = props;

    const { canView, canClick } = resolveButtonAccessState(
      accessRequirements,
      resolveAccess,
      accessDeniedBehavior,
    );

    if (!canView) {
      return null;
    }

    const resolvedDisabled = disabled || loading || !canClick;
    const iconClassName =
      variant === ButtonVariant.Text ? 'h-3.5 w-3.5' : 'h-4 w-4';
    const resolvedSize =
      size ?? (variant === ButtonVariant.Icon ? 'icon' : undefined);
    let leadingVisual: ReactNode = null;
    let trailingVisual: ReactNode = null;

    if (loading) {
      leadingVisual = (
        <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
      );
    } else if (leftIcon) {
      leadingVisual = (
        <Icon aria-hidden="true" icon={leftIcon} className={iconClassName} />
      );

      if (rightIcon) {
        trailingVisual = (
          <Icon aria-hidden="true" icon={rightIcon} className={iconClassName} />
        );
      }
    } else if (rightIcon) {
      trailingVisual = (
        <Icon aria-hidden="true" icon={rightIcon} className={iconClassName} />
      );
    }

    return (
      <UIButton
        ref={ref}
        variant={BUTTON_VARIANT_MAPPING[variant]}
        size={resolvedSize}
        disabled={resolvedDisabled}
        aria-busy={loading || undefined}
        className={cn(
          'rounded-sm',
          BUTTON_VARIANT_CLASS_NAMES[variant],
          className,
        )}
        {...rest}
      >
        {leadingVisual}
        {label ?? children}
        {trailingVisual}
      </UIButton>
    );
  },
);

Button.displayName = 'Button';
