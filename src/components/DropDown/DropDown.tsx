import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@ui/select';

import {
  formErrorTextClassName,
  formHelperTextClassName,
} from '@lib/feedbackText';
import {
  optionItemBaseClassName,
  optionListEmptyStateClassName,
} from '@lib/optionItemStyles';
import { Label } from '@ui/label';
import { cn } from '@lib/utils';
import type { DropDownProps } from './types';
import { resolveDropDownAccessState } from './helpers';

export const DropDown = (props: Readonly<DropDownProps>) => {
  const {
    options,
    value,
    onChange,
    label,
    placeholder = 'Select an option',
    renderOption,
    required,
    disabled,
    helperText,
    error,
    onOpenChange,
    accessRequirements,
    resolveAccess,
    className,
  } = props;

  const { canView, canEdit } = resolveDropDownAccessState(
    accessRequirements,
    resolveAccess,
  );

  if (!canView) {
    return null;
  }

  const selectedOption = options.find((option) => option.value === value);
  const resolvedDisabled = disabled || !canEdit;

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <div className="space-y-1">
          <Label className="text-sm font-medium text-foreground/85">
            {label}
            {required && <span className="text-destructive"> *</span>}
          </Label>
        </div>
      )}
      <Select
        value={value}
        onValueChange={onChange}
        disabled={resolvedDisabled}
        onOpenChange={onOpenChange}
      >
        <SelectTrigger
          className={cn(
            '[&>span]:text-[length:var(--mz-control-font-size)] [&>span]:text-muted-foreground',
            error && 'border-destructive',
          )}
          aria-invalid={error ? 'true' : undefined}
        >
          <SelectValue placeholder={placeholder}>
            {selectedOption && (
              <span className="text-[length:var(--mz-control-font-size)] text-foreground">
                {renderOption
                  ? renderOption(selectedOption)
                  : selectedOption.label}
              </span>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="[&_[data-slot=select-viewport]]:p-0">
          <div className="max-h-[200px] overflow-y-auto border-t border-border pt-0">
            {options.length === 0 ? (
              <div className={optionListEmptyStateClassName}>
                No options found
              </div>
            ) : (
              options.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className={cn(
                    'relative cursor-pointer pl-0 pr-0 transition-colors focus:bg-muted focus:text-foreground data-[state=checked]:bg-muted data-[state=checked]:text-foreground [&>span:first-child]:hidden',
                    optionItemBaseClassName,
                  )}
                >
                  <span className="truncate">
                    {renderOption ? renderOption(option) : option.label}
                  </span>
                </SelectItem>
              ))
            )}
          </div>
        </SelectContent>
      </Select>
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
};
