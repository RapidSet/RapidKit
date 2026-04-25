import { forwardRef, type ChangeEvent, type KeyboardEvent } from 'react';
import { cn } from '@lib/utils';
import {
  formErrorTextClassName,
  formHelperTextClassName,
  formInfoTextClassName,
} from '@lib/feedbackText';
import { Label } from '@ui/label';
import { Input as ShadcnInput } from '@ui/input';
import { resolveInputAccess } from '@components/Input/helpers';
import { InputProps } from '@components/Input/types';

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const {
    className,
    label,
    error,
    helperText,
    infoText,
    endAdornment,
    name,
    value = '',
    onChange,
    required,
    access,
    canAccess,
    disabled,
    onKeyDown,
    ...rest
  } = props;

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e);
  };

  const { hasViewPermission, hasEditPermission } = resolveInputAccess(
    access,
    canAccess,
  );

  if (!hasViewPermission) {
    return null;
  }

  const isReadOnly = hasViewPermission && !hasEditPermission;

  return (
    <div className="space-y-2">
      {label && (
        <Label className="text-xs text-muted-foreground" htmlFor={name}>
          {label}
          {required && <span className="text-destructive">*</span>}
        </Label>
      )}
      <div className="relative">
        <ShadcnInput
          {...rest}
          id={name}
          name={name}
          required={required}
          type={rest.type ?? 'text'}
          className={cn(
            error && 'border-destructive',
            'rounded-sm border ring-0',
            'text-[length:var(--rk-control-font-size)] placeholder:text-[length:var(--rk-control-font-size)] placeholder:text-muted-foreground/60',
            endAdornment && 'pr-10',
            className,
          )}
          ref={ref}
          onChange={handleInputChange}
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
            e.stopPropagation();
            onKeyDown?.(e);
          }}
          value={value}
          disabled={isReadOnly || disabled}
          placeholder={rest.placeholder}
          aria-invalid={error ? 'true' : undefined}
        />
        {endAdornment ? (
          <div className="absolute inset-y-0 right-2 flex items-center">
            {endAdornment}
          </div>
        ) : null}
      </div>
      {(error || helperText || infoText) && (
        <div className="space-y-1">
          {error && <p className={formErrorTextClassName}>{error}</p>}
          {helperText && (
            <p className={formHelperTextClassName}>{helperText}</p>
          )}
          {infoText && <p className={formInfoTextClassName}>{infoText}</p>}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';
