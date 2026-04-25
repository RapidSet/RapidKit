import { forwardRef, type ChangeEvent } from 'react';
import { Check } from 'lucide-react';
import { useAccessResolver } from '@lib/use-access-resolver';
import {
  formErrorTextClassName,
  formHelperTextClassName,
} from '@lib/feedbackText';
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
      access,
      canAccess,
      disabled,
      onChange,
      ...params
    } = props;
    const resolvedCanAccess = useAccessResolver(canAccess);

    const { canView, canEdit } = resolveCheckboxAccessState(
      access,
      resolvedCanAccess,
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
          <span className="relative inline-flex items-center justify-center">
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
                'peer',
                error && 'border-destructive',
                className,
              )}
              {...params}
            />
            <Check
              aria-hidden="true"
              className="pointer-events-none absolute h-3 w-3 text-primary-foreground opacity-0 transition-opacity duration-150 peer-checked:opacity-100"
            />
          </span>
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

Checkbox.displayName = 'Checkbox';
