import { forwardRef, type ChangeEvent, type KeyboardEvent } from 'react';
import { cn } from '@lib/utils';
import {
  formErrorTextClassName,
  formHelperTextClassName,
  formInfoTextClassName,
} from '@lib/feedbackText';
import { Label } from '@ui/label';
import { Textarea as ShadcnTextArea } from '@ui/textarea';
import { TextAreaProps } from './types';

const resolveTextAreaAccess = (
  requirements: string[] | undefined,
  resolveAccess: TextAreaProps['resolveAccess'],
) => {
  const normalizedRequirements = requirements ?? [];
  const hasAccessResolver =
    normalizedRequirements.length > 0 && Boolean(resolveAccess);

  if (!hasAccessResolver) {
    return {
      hasViewPermission: true,
      hasEditPermission: true,
    };
  }

  const readRequirements = normalizedRequirements.filter((requirement) =>
    requirement.endsWith('.read'),
  );
  const writeRequirements = normalizedRequirements.filter((requirement) =>
    requirement.endsWith('.write'),
  );

  let viewRequirements = normalizedRequirements;
  if (readRequirements.length > 0) {
    viewRequirements = readRequirements;
  } else if (writeRequirements.length > 0) {
    viewRequirements = [];
  }

  const editRequirements =
    writeRequirements.length > 0 ? writeRequirements : normalizedRequirements;

  const hasViewPermission =
    viewRequirements.length === 0 ||
    viewRequirements.some((requirement) =>
      resolveAccess?.(requirement, 'view'),
    );

  if (!hasViewPermission) {
    return {
      hasViewPermission,
      hasEditPermission: false,
    };
  }

  const hasEditPermission = editRequirements.some((requirement) =>
    resolveAccess?.(requirement, 'edit'),
  );

  return {
    hasViewPermission,
    hasEditPermission,
  };
};

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
      accessRequirements,
      resolveAccess,
      disabled,
      onKeyDown,
      ...rest
    } = props;

    const handleTextAreaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e);
    };

    const { hasViewPermission, hasEditPermission } = resolveTextAreaAccess(
      accessRequirements,
      resolveAccess,
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
