import { forwardRef } from 'react';
import {
  formErrorTextClassName,
  formHelperTextClassName,
} from '@lib/feedbackText';
import { cn } from '@lib/utils';
import { Label } from '@ui/label';
import { Switch } from '@ui/switch';
import { resolveToggleAccessState } from './helpers';
import { ToggleProps } from './types';

export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
  (props, ref) => {
    const {
      name,
      label,
      title,
      helperText,
      error,
      required,
      className,
      onCheckedChange,
      onToggleChange,
      accessRequirements,
      resolveAccess,
      disabled,
      ...rest
    } = props;

    const { canView, canEdit } = resolveToggleAccessState(
      accessRequirements,
      resolveAccess,
    );

    if (!canView) {
      return null;
    }

    const resolvedDisabled = disabled || !canEdit;

    const handleCheckedChange = (checked: boolean) => {
      onToggleChange?.(checked, name);
      onCheckedChange?.(checked);
    };

    return (
      <div className="space-y-2">
        {label && (
          <Label className="text-xs text-muted-foreground" htmlFor={name}>
            {label}
            {required && <span className="text-destructive">*</span>}
          </Label>
        )}
        <div className="flex items-center gap-2">
          <Switch
            ref={ref}
            id={name}
            name={name}
            aria-invalid={error ? 'true' : undefined}
            disabled={resolvedDisabled}
            onCheckedChange={handleCheckedChange}
            className={cn(error && 'border-destructive', className)}
            {...rest}
          />
          {title && <span className="text-sm text-foreground">{title}</span>}
        </div>
        {(error || helperText) && (
          <div className="space-y-1">
            {error && <p className={formErrorTextClassName}>{error}</p>}
            {helperText && (
              <p className={formHelperTextClassName}>{helperText}</p>
            )}
          </div>
        )}
      </div>
    );
  },
);

Toggle.displayName = 'Toggle';
