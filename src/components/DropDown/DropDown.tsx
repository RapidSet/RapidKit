import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@ui/select';
import { X } from 'lucide-react';

import {
  formErrorTextClassName,
  formHelperTextClassName,
} from '@lib/feedbackText';
import { useAccessResolver } from '@lib/use-access-resolver';
import {
  optionItemBaseClassName,
  optionItemDropdownStateClassName,
  optionItemInteractiveClassName,
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
    access,
    canAccess,
    className,
  } = props;

  const resolvedCanAccess = useAccessResolver(canAccess);

  const { canView, canEdit } = resolveDropDownAccessState(
    access,
    resolvedCanAccess,
  );

  if (!canView) {
    return null;
  }

  const selectedOption = options.find((option) => option.value === value);
  const resolvedDisabled = disabled || !canEdit;
  const canClear = Boolean(value) && !resolvedDisabled;

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
      <div className="relative">
        <Select
          value={value}
          onValueChange={onChange}
          disabled={resolvedDisabled}
          onOpenChange={onOpenChange}
        >
          <SelectTrigger
            className={cn(
              'rounded-sm border ring-0',
              canClear && 'pr-10 [&>svg]:hidden',
              '[&>span]:text-[length:var(--rk-control-font-size)] data-[placeholder]:text-muted-foreground/60',
              error && 'border-destructive',
            )}
            aria-invalid={error ? 'true' : undefined}
          >
            <SelectValue placeholder={placeholder}>
              {selectedOption && (
                <span className="text-[length:var(--rk-control-font-size)] text-foreground">
                  {renderOption
                    ? renderOption(selectedOption)
                    : selectedOption.label}
                </span>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="[&_[data-slot=select-viewport]]:p-0">
            <div className="max-h-[200px] overflow-y-auto pt-0">
              {options.length === 0 ? (
                <div
                  className={cn(
                    optionListEmptyStateClassName,
                    'px-[var(--rk-control-padding-x)]',
                  )}
                >
                  No options found
                </div>
              ) : (
                options.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className={cn(
                      optionItemBaseClassName,
                      optionItemInteractiveClassName,
                      optionItemDropdownStateClassName,
                    )}
                  >
                    <span className="block w-full truncate">
                      {renderOption ? renderOption(option) : option.label}
                    </span>
                  </SelectItem>
                ))
              )}
            </div>
          </SelectContent>
        </Select>
        {canClear && (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onChange('');
            }}
            aria-label="Clear selection"
            className="absolute right-3 top-1/2 inline-flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-sm text-muted-foreground/80 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:shadow-[var(--rk-control-shadow-focus)]"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
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
};
