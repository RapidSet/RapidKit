import * as React from 'react';
import { CalendarIcon } from 'lucide-react';
import {
  formErrorTextClassName,
  formHelperTextClassName,
} from '@lib/feedbackText';
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

const DATE_PICKER_CALENDAR_CLASS_NAMES = {
  month_caption:
    'relative flex items-center justify-center border-b border-[hsl(var(--mz-control-border))] pb-2',
  caption:
    'relative flex items-center justify-center border-b border-[hsl(var(--mz-control-border))] pb-2',
  caption_label:
    'text-[length:var(--mz-control-font-size)] font-semibold tracking-[0.01em] text-foreground',
  nav: 'space-x-1 flex items-center',
  button_previous:
    'absolute left-1 h-7 w-7 rounded-md border border-[hsl(var(--mz-control-border))] bg-background p-0 opacity-80 shadow-[var(--mz-control-shadow)] transition-[background-color,color,border-color,box-shadow] duration-150 hover:bg-accent hover:text-accent-foreground hover:opacity-100',
  button_next:
    'absolute right-1 h-7 w-7 rounded-md border border-[hsl(var(--mz-control-border))] bg-background p-0 opacity-80 shadow-[var(--mz-control-shadow)] transition-[background-color,color,border-color,box-shadow] duration-150 hover:bg-accent hover:text-accent-foreground hover:opacity-100',
  nav_button:
    'h-7 w-7 rounded-md border border-[hsl(var(--mz-control-border))] bg-background p-0 opacity-80 shadow-[var(--mz-control-shadow)] transition-[background-color,color,border-color,box-shadow] duration-150 hover:bg-accent hover:text-accent-foreground hover:opacity-100',
  weekdays: 'flex',
  weekday:
    'w-9 rounded-md text-center text-[0.75rem] font-medium uppercase tracking-[0.04em] text-muted-foreground',
  head_cell:
    'w-9 rounded-md text-center text-[0.75rem] font-medium uppercase tracking-[0.04em] text-muted-foreground',
  week: 'mt-2 flex w-full',
  day: 'relative h-9 w-9 p-0 text-center text-[length:var(--mz-control-font-size)]',
  day_button:
    'h-9 w-9 rounded-md p-0 font-medium hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:shadow-[var(--mz-control-shadow-focus)]',
  day_selected:
    'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground',
  day_today: 'bg-accent text-accent-foreground',
  day_outside: 'text-muted-foreground opacity-50',
  day_disabled: 'text-muted-foreground opacity-50',
  day_range_middle:
    'aria-selected:bg-accent aria-selected:text-accent-foreground',
  day_hidden: 'invisible',
} as const;

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
              'h-[var(--mz-control-height)] w-full justify-start gap-2 rounded-md border-[hsl(var(--mz-control-border))] bg-background px-[var(--mz-control-padding-x)] py-[var(--mz-control-padding-y)] text-left text-[length:var(--mz-control-font-size)] font-medium text-foreground shadow-[var(--mz-control-shadow)] transition-[background-color,color,border-color,box-shadow] duration-200 hover:bg-accent/45 hover:text-accent-foreground focus-visible:shadow-[var(--mz-control-shadow-focus)]',
              !value && 'text-muted-foreground',
              error &&
                'border-destructive focus-visible:shadow-[0_0_0_3px_hsl(var(--mz-destructive)/0.2)]',
            )}
            disabled={resolvedDisabled}
          >
            <CalendarIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
            {value ? (
              <span className="truncate">{formatDateLabel(value)}</span>
            ) : (
              <span className="truncate">{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto rounded-md border-[hsl(var(--mz-control-border))] bg-popover p-0 text-popover-foreground shadow-[var(--mz-control-shadow)]"
          align="start"
        >
          <Calendar
            mode="single"
            selected={selectedDate}
            className="font-sans text-foreground"
            classNames={DATE_PICKER_CALENDAR_CLASS_NAMES}
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
}
