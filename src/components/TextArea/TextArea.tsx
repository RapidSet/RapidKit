import { forwardRef, type ChangeEvent, type KeyboardEvent } from 'react';
import { useAccessResolver } from '@lib/use-access-resolver';
import { cn } from '@lib/utils';
import {
  formErrorTextClassName,
  formHelperTextClassName,
  formInfoTextClassName,
} from '@lib/feedbackText';
import { Label } from '@ui/label';
import { Textarea as ShadcnTextArea } from '@ui/textarea';
import { resolveTextAreaAccessState } from '@components/TextArea/helpers';
import { TextAreaProps } from '@components/TextArea/types';

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (props, ref) => {
    const {
      className,
      label,
      error,
      helperText,
      infoText,
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
    const resolvedCanAccess = useAccessResolver(canAccess);

    const handleTextAreaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e);
    };

    const { hasViewPermission, hasEditPermission } = resolveTextAreaAccessState(
      access,
      resolvedCanAccess,
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
        <ShadcnTextArea
          {...rest}
          id={name}
          name={name}
          required={required}
          className={cn(
            error && 'border-destructive',
            'min-h-[calc(var(--rk-control-height)*2)] rounded-sm border ring-0',
            'text-[length:var(--rk-control-font-size)] placeholder:text-[length:var(--rk-control-font-size)] placeholder:text-muted-foreground/60',
            className,
          )}
          ref={ref}
          onChange={handleTextAreaChange}
          onKeyDown={(e: KeyboardEvent<HTMLTextAreaElement>) => {
            e.stopPropagation();
            onKeyDown?.(e);
          }}
          value={value}
          disabled={isReadOnly || disabled}
          placeholder={rest.placeholder}
          aria-invalid={error ? 'true' : undefined}
        />
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
  },
);

TextArea.displayName = 'TextArea';
