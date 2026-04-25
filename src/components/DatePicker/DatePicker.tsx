import * as React from 'react';
import { CalendarIcon } from 'lucide-react';
import { useAccessResolver } from '@lib/use-access-resolver';
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
  month: 'flex w-full flex-col gap-3',
  month_caption:
    'relative flex h-10 w-full items-center justify-center border-b border-[hsl(var(--rk-control-border))] px-10 pb-2',
  caption:
    'relative flex h-10 w-full items-center justify-center border-b border-[hsl(var(--rk-control-border))] px-10 pb-2',
  caption_label:
    'flex items-center gap-1 text-[length:var(--rk-control-font-size)] font-semibold tracking-[0.01em] text-foreground [&>svg]:pointer-events-none [&>svg]:size-3.5 [&>svg]:text-muted-foreground',
  nav: 'pointer-events-none absolute inset-x-0 top-0 z-20 flex h-10 items-center justify-between',
  dropdowns:
    'pointer-events-none inline-flex h-8 items-center justify-center gap-1.5 text-[length:var(--rk-control-font-size)] font-semibold',
  dropdown_root:
    'pointer-events-auto relative rounded-md bg-transparent text-foreground transition-[color] duration-150 hover:text-accent-foreground has-focus:text-accent-foreground',
  dropdown: 'absolute inset-0 cursor-pointer opacity-0',
  button_previous:
    'pointer-events-auto absolute left-1 z-30 h-7 w-7 cursor-pointer rounded-md border border-transparent bg-transparent p-0 text-muted-foreground opacity-80 shadow-none transition-[background-color,color,border-color,box-shadow] duration-150 hover:bg-accent hover:text-accent-foreground hover:opacity-100 focus-visible:outline-none focus-visible:shadow-[var(--rk-control-shadow-focus)]',
  button_next:
    'pointer-events-auto absolute right-1 z-30 h-7 w-7 cursor-pointer rounded-md border border-transparent bg-transparent p-0 text-muted-foreground opacity-80 shadow-none transition-[background-color,color,border-color,box-shadow] duration-150 hover:bg-accent hover:text-accent-foreground hover:opacity-100 focus-visible:outline-none focus-visible:shadow-[var(--rk-control-shadow-focus)]',
  nav_button:
    'h-7 w-7 rounded-md border border-transparent bg-transparent p-0 text-muted-foreground opacity-80 shadow-none transition-[background-color,color,border-color,box-shadow] duration-150 hover:bg-accent hover:text-accent-foreground hover:opacity-100 focus-visible:outline-none focus-visible:shadow-[var(--rk-control-shadow-focus)]',
  weekdays: 'flex',
  weekday:
    'w-9 rounded-md text-center text-[0.75rem] font-medium uppercase tracking-[0.04em] text-muted-foreground',
  head_cell:
    'w-9 rounded-md text-center text-[0.75rem] font-medium uppercase tracking-[0.04em] text-muted-foreground',
  week: 'mt-1.5 flex w-full',
  day: 'relative h-9 w-9 p-0 text-center text-[length:var(--rk-control-font-size)]',
  day_button:
    'h-9 w-9 rounded-md p-0 font-normal hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:shadow-[var(--rk-control-shadow-focus)]',
  day_selected:
    'bg-primary text-primary-foreground font-medium hover:bg-primary hover:text-primary-foreground',
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
    access,
    canAccess,
    open: controlledOpen,
    onOpenChange,
    placeholder = 'Select date',
    startMonth = new Date(2000, 0),
    endMonth = new Date(2050, 11),
  } = props;
  const resolvedCanAccess = useAccessResolver(canAccess);
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
    access,
    resolvedCanAccess,
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
              'h-[var(--rk-control-height)] w-full justify-start gap-2 rounded-sm border-[hsl(var(--rk-control-border))] bg-background px-[var(--rk-control-padding-x)] py-[var(--rk-control-padding-y)] text-left text-[length:var(--rk-control-font-size)] font-medium text-foreground ring-0 shadow-none transition-[border-color,box-shadow] duration-150 hover:bg-background hover:text-foreground focus-visible:shadow-[var(--rk-control-shadow-focus)]',
              error &&
                'border-destructive focus-visible:shadow-[0_0_0_3px_hsl(var(--rk-destructive)/0.2)]',
            )}
            disabled={resolvedDisabled}
          >
            <CalendarIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
            {value ? (
              <span className="truncate !text-[length:var(--rk-control-font-size)] !font-normal leading-normal text-foreground">
                {formatDateLabel(value)}
              </span>
            ) : (
              <span className="truncate !text-[length:var(--rk-control-font-size)] !font-normal leading-normal text-muted-foreground/60">
                {placeholder}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto rounded-md border-[hsl(var(--rk-control-border))] bg-popover p-0 text-popover-foreground shadow-[var(--rk-control-shadow)]"
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
