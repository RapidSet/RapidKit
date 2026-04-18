'use client';

import * as React from 'react';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@lib/utils';
import { Button } from '@ui/button';
import { Calendar } from '@ui/calendar';
import { Label } from '@ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@ui/popover';
import { DatePickerProps } from './types';
import {
  formatDateLabel,
  parseDateValue,
  resolveDatePickerAccessState,
  toLocalDateValue,
} from './helpers';

export function DatePicker(props: Readonly<DatePickerProps>) {
  const {
    value,
    onChange,
    label,
    name,
    required,
    disabled,
    helperText,
    error,
    className,
    accessRequirements,
    resolveAccess,
    open: controlledOpen,
    onOpenChange,
    placeholder = 'Select date',
    startMonth = new Date(2000, 0),
    endMonth = new Date(2050, 11),
  } = props;
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);

  const selectedDate = React.useMemo(() => parseDateValue(value), [value]);
  const isOpen = controlledOpen ?? uncontrolledOpen;

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange?.(nextOpen);
    if (controlledOpen === undefined) {
      setUncontrolledOpen(nextOpen);
    }
  };

  const { canView, canEdit } = resolveDatePickerAccessState(
    accessRequirements,
    resolveAccess,
  );

  if (!canView) {
    return null;
  }

  const isReadOnly = !canEdit;
  const resolvedDisabled = disabled || isReadOnly;

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label htmlFor={name} className="text-xs text-muted-foreground">
          {label}
          {required && <span className="text-destructive">*</span>}
        </Label>
      )}
      <Popover open={isOpen} onOpenChange={handleOpenChange} modal={true}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id={name}
            name={name}
            aria-invalid={error ? 'true' : undefined}
            className={cn(
              'h-10 w-full justify-start text-left text-xs font-normal text-foreground',
              !value && 'text-muted-foreground',
            )}
            disabled={resolvedDisabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? (
              <span>{formatDateLabel(value)}</span>
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(nextDate) => {
              onChange({
                target: {
                  name,
                  value: nextDate ? toLocalDateValue(nextDate) : undefined,
                },
              });
              handleOpenChange(false);
            }}
            disabled={resolvedDisabled}
            autoFocus
            captionLayout="dropdown"
            startMonth={startMonth}
            endMonth={endMonth}
          />
        </PopoverContent>
      </Popover>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
      {helperText && (
        <p className="text-xs text-muted-foreground opacity-60">{helperText}</p>
      )}
    </div>
  );
}
