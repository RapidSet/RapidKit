import { forwardRef, type ChangeEvent } from 'react';
import { cn } from '@lib/utils';
import { Label } from '@ui/label';
import { CheckBoxProps } from './types';
import { checkboxBaseClassName, resolveCheckboxAccessState } from './helpers';

export const Checkbox = forwardRef<HTMLInputElement, CheckBoxProps>(
  (props, ref) => {
    const {
      onCheckChange,
      label,
      title,
      name,
      error,
      helperText,
      required,
      className,
      accessRequirements,
      resolveAccess,
      disabled,
      onChange,
      ...params
    } = props;

    const { canView, canEdit } = resolveCheckboxAccessState(
      accessRequirements,
      resolveAccess,
    );

    if (!canView) {
      return null;
    }

    const resolvedDisabled = disabled || !canEdit;

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      onCheckChange?.(event.target.checked, name);
      onChange?.(event);
    };

    return (
      <div className="space-y-2">
        {label && (
          <Label className="text-xs text-muted-foreground" htmlFor={name}>
            {label}
            {required && <span className="text-destructive">*</span>}
          </Label>
        )}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id={name}
            name={name}
            ref={ref}
            aria-invalid={error ? 'true' : undefined}
            onChange={handleChange}
            disabled={resolvedDisabled}
            className={cn(
              checkboxBaseClassName,
              error && 'border-destructive',
              className,
            )}
            {...params}
          />
          {title && <span className="text-sm text-foreground">{title}</span>}
        </div>
        {error && <p className="text-xs text-destructive">{error}</p>}
        {helperText && (
          <p className="text-xs text-muted-foreground">{helperText}</p>
        )}
      </div>
    );
  },
);

Checkbox.displayName = 'Checkbox';
