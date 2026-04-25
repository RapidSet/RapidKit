import { resolveViewEditAccessState } from '@lib/view-edit-access';
import type { DatePickerProps } from './types';

const dateLabelFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: '2-digit',
  year: 'numeric',
});

export const formatDateLabel = (value: string) => {
  const parsedDate = parseDateValue(value);
  if (!parsedDate) {
    return value;
  }

  return dateLabelFormatter.format(parsedDate);
};

export const parseDateValue = (value: string | undefined) => {
  if (!value) {
    return undefined;
  }

  const parts = value.split('-');
  if (parts.length === 3) {
    const [year, month, day] = parts.map(Number);
    if (!Number.isNaN(year) && !Number.isNaN(month) && !Number.isNaN(day)) {
      return new Date(year, month - 1, day);
    }
  }

  const parsedFallback = new Date(value);
  if (Number.isNaN(parsedFallback.getTime())) {
    return undefined;
  }

  return parsedFallback;
};

export const toLocalDateValue = (value: Date) => {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const resolveDatePickerAccessState = (
  access: DatePickerProps['access'],
  canAccess: DatePickerProps['canAccess'],
) => resolveViewEditAccessState(access, canAccess);
